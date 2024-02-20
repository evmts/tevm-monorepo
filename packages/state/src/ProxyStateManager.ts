// [mozilla public license 2.0](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/LICENSE)
import { Trie } from '@ethereumjs/trie'
import { keccak256 } from 'ethereum-cryptography/keccak.js'

import { AccountCache, CacheType, StorageCache } from '@ethereumjs/statemanager'

import { Cache } from './Cache.js'
import type { TevmState } from './TevmState.js'
import type { TevmStateManagerInterface } from './TevmStateManagerInterface.js'
import type { AccountFields, StorageDump } from '@ethereumjs/common'
import type { StorageRange } from '@ethereumjs/common'
import type { Proof } from '@ethereumjs/statemanager'
import {
	type Address,
	type BlockTag,
	EthjsAccount,
	EthjsAddress,
	bytesToHex,
	hexToBytes,
	isHex,
	toBytes,
	toHex,
} from '@tevm/utils'
// TODO remove me in faovr of @tevm/jsonrpc
import { type PublicClient, createPublicClient, http } from 'viem'

export interface ProxyStateManagerOpts {
	/**
	 * Url to a JSON-RPC provider to proxy state from
	 */
	url: string
	/**
	 * The expected time between blocks in milliseconds
	 * This is used to avoid fetching blockNumber if the blockNumber is not expected to have changed
	 * Defaults to 2000ms (2s)
	 */
	expectedBlockTime?: number
	/**
	 * Called when state manager commits state
	 */
	onCommit?: (stateManager: ProxyStateManager) => void
}

// TODO this should be using @tevm/jsonrpc package instead of viem
/**
 * A state manager that will fetch state from a remote rpc provider
 * future requests. Used internally in `MemoryTevm`
 * @example
 * ```ts
 * import { TevmStateManager } from '@tevm/state'
 * import { createMemoryClient } from 'tevm/vm'
 *
 * const stateManager = new TevmStateManager({
 *   url: 'https://mainnet.optimism.io',
 *   blockTag: 'latest'
 * })
 * ```
 * @see NormalStateManager for a state manager that does not fork state
 * @see ForkStateManager for a provider that uses forks state rather than always using latest state
 */
export class ProxyStateManager implements TevmStateManagerInterface {
	/**
	 * The current block tag represents what block the proxy manager considers the cannonical head at this moment.
	 * To prevent bugs this block tag must be locked to a specific number while a call is being executed in the EVM
	 * When a call is not currently executed this blocktag is unlocked and set back to 'latest'
	 */
	protected _currentBlockTag: { blockTag: BlockTag } | { blockNumber: bigint } =
		{ blockTag: 'latest' }
	/**
	 * We track the block tag the cache was using so we can invalidate it whenever it changes
	 */
	protected _cachedBlockTag: { blockNumber: bigint | undefined } = {
		blockNumber: undefined,
	}
	/**
	 * Cache the last time we fetched a block to avoid fetching it too often
	 */
	protected _lastBlockFetchTime = -Infinity
	/**
	 * How often we expect the block number to change
	 */
	protected _expectedBlockTime: number
	protected _contractCache: Map<string, Uint8Array>
	protected _storageCache: StorageCache
	protected _accountCache: AccountCache
	originalStorageCache: Cache
	protected client: PublicClient
	constructor(public readonly opts: ProxyStateManagerOpts) {
		// TODO this should be using @tevm/jsonrpc package instead of viem
		this.client = createPublicClient({
			transport: http(opts.url),
			name: 'tevm-state-manager-viem-client',
		})
		this._contractCache = new Map()
		this._storageCache = new StorageCache({
			size: 100000,
			type: CacheType.ORDERED_MAP,
		})
		this._accountCache = new AccountCache({
			size: 100000,
			type: CacheType.ORDERED_MAP,
		})

		this.originalStorageCache = new Cache(this.getContractStorage.bind(this))
		this._expectedBlockTime = opts.expectedBlockTime ?? 2_000
	}

	/**
	 * Locks the state manager to always fetch state from the current block number as of when lock is called
	 * If the block number has changed the cache will be invalidated
	 */
	async lock(): Promise<void> {
		const shouldCheckBlock =
			Date.now() - this._lastBlockFetchTime > this._expectedBlockTime
		if (!shouldCheckBlock) {
			return
		}
		const blockNumber = await this.client.getBlockNumber()
		if (this._cachedBlockTag.blockNumber === blockNumber) {
			return
		}
		this._lastBlockFetchTime = Date.now()
		this._currentBlockTag = {
			blockNumber,
		}
		if (
			this._cachedBlockTag.blockNumber &&
			this._cachedBlockTag.blockNumber !== blockNumber
		) {
			this._storageCache.clear()
			this._accountCache.clear()
		}
	}

	/**
	 * Unlocks the state manager to always fetch state from latest
	 * The cache will persist when unlocked so there is o guarantee
	 * the evm state is not stale if talking to the state manager
	 * directly in unlocked mode. Most transactions should lock
	 */
	async unlock(): Promise<void> {
		this._currentBlockTag = {
			blockTag: 'latest',
		}
	}

	/**
	 * Returns a new instance of the TevmStateManager with the same opts
	 */
	shallowCopy(): ProxyStateManager {
		const newState = new ProxyStateManager({
			url: this.opts.url,
		})
		newState._contractCache = new Map(this._contractCache)
		newState._storageCache = new StorageCache({
			size: 100000,
			type: CacheType.ORDERED_MAP,
		})
		newState._accountCache = new AccountCache({
			size: 100000,
			type: CacheType.ORDERED_MAP,
		})
		return newState
	}

	// TODO this is gonna be too slow eventually for large state
	/**
	 * Returns a new instance of the ForkStateManager with the same opts and all storage copied over
	 */
	async deepCopy(): Promise<ProxyStateManager> {
		const newState = new ProxyStateManager({
			url: this.opts.url,
			expectedBlockTime: this._expectedBlockTime,
		})
		newState._contractCache = new Map(this._contractCache)

		await newState.generateCanonicalGenesis(await this.dumpCanonicalGenesis())

		await newState.checkpoint()
		await newState.commit()

		return newState
	}

	/**
	 * Resets all internal caches
	 */
	clearCaches(): void {
		this._contractCache.clear()
		this._storageCache.clear()
		this._accountCache.clear()
	}

	/**
	 * Gets the code corresponding to the provided `address`.
	 * @param address - Address to get the `code` for
	 * @returns {Promise<Uint8Array>} - Resolves with the code corresponding to the provided address.
	 * Returns an empty `Uint8Array` if the account has no associated code.
	 */
	async getContractCode(address: EthjsAddress): Promise<Uint8Array> {
		let codeBytes = this._contractCache.get(address.toString())
		if (codeBytes !== undefined) return codeBytes
		const code = await this.client.getBytecode({
			address: address.toString() as Address,
			...this._currentBlockTag,
		})
		if (code !== undefined) {
			codeBytes = hexToBytes(code)
			this._contractCache.set(address.toString(), codeBytes)
		}
		return codeBytes ?? new Uint8Array(0)
	}

	/**
	 * Adds `value` to the state trie as code, and sets `codeHash` on the account
	 * corresponding to `address` to reference this.
	 * @param address - Address of the `account` to add the `code` for
	 * @param value - The value of the `code`
	 */
	async putContractCode(
		address: EthjsAddress,
		value: Uint8Array,
	): Promise<void> {
		// Store contract code in the cache
		this._contractCache.set(address.toString(), value)
	}

	/**
	 * Gets the storage value associated with the provided `address` and `key`. This method returns
	 * the shortest representation of the stored value.
	 * @param address - Address of the account to get the storage for
	 * @param key - Key in the account's storage to get the value for. Must be 32 bytes long.
	 * @returns {Uint8Array} - The storage value for the account
	 * corresponding to the provided address at the provided key.
	 * If this does not exist an empty `Uint8Array` is returned.
	 */
	async getContractStorage(
		address: EthjsAddress,
		key: Uint8Array,
	): Promise<Uint8Array> {
		// Check storage slot in cache
		if (key.length !== 32) {
			throw new Error('Storage key must be 32 bytes long')
		}
		const account = await this.getAccount(address)
		if (!account) {
			throw new Error('getContractStorage() called on non-existing account')
		}

		const cachedValue = this._storageCache?.get(address, key)
		if (cachedValue !== undefined) {
			return cachedValue
		}

		const storage = await this.client.getStorageAt({
			address: address.toString() as Address,
			slot: bytesToHex(key),
			...this._currentBlockTag,
		})
		if (storage === undefined) {
			throw new Error('getContractStorage() called on non-existing account')
		}
		const value = hexToBytes(storage)

		await this.putContractStorage(address, key, value)

		return value
	}

	/**
	 * Adds value to the cache for the `account`
	 * corresponding to `address` at the provided `key`.
	 * @param address - Address to set a storage value for
	 * @param key - Key to set the value at. Must be 32 bytes long.
	 * @param value - Value to set at `key` for account corresponding to `address`.
	 * Cannot be more than 32 bytes. Leading zeros are stripped.
	 * If it is empty or filled with zeros, deletes the value.
	 */
	async putContractStorage(
		address: EthjsAddress,
		key: Uint8Array,
		value: Uint8Array,
	): Promise<void> {
		this._storageCache.put(address, key, value)
	}

	/**
	 * Clears all storage entries for the account corresponding to `address`.
	 * @param address - Address to clear the storage of
	 */
	async clearContractStorage(address: EthjsAddress): Promise<void> {
		this._storageCache.clearContractStorage(address)
	}

	/**
	 * Dumps the RLP-encoded storage values for an `account` specified by `address`.
	 * @param address - The address of the `account` to return storage for
	 * @returns {Promise<StorageDump>} - The state of the account as an `Object` map.
	 * Keys are the storage keys, values are the storage values as strings.
	 * Both are represented as `0x` prefixed hex strings.
	 */
	dumpStorage(address: EthjsAddress): Promise<StorageDump> {
		const storageMap = this._storageCache.dump(address)
		const dump: StorageDump = {}
		if (storageMap !== undefined) {
			for (const slot of storageMap) {
				dump[slot[0]] = bytesToHex(slot[1])
			}
		}
		return Promise.resolve(dump)
	}

	dumpStorageRange(
		_address: EthjsAddress,
		_startKey: bigint,
		_limit: number,
	): Promise<StorageRange> {
		return Promise.reject()
	}

	/**
	 * Checks if an `account` exists at `address`
	 * @param address - Address of the `account` to check
	 */
	async accountExists(address: EthjsAddress): Promise<boolean> {
		const localAccount = this._accountCache.get(address)
		if (localAccount !== undefined) return true
		const proof = await this.client.getProof({
			address: address.toString() as Address,
			storageKeys: [],
			...this._currentBlockTag,
		})
		const proofBuf = proof.accountProof.map((proofNode: string) =>
			toBytes(proofNode),
		)
		const trie = new Trie({ useKeyHashing: true })
		const verified = await trie.verifyProof(
			keccak256(proofBuf[0] as Uint8Array),
			address.bytes,
			proofBuf,
		)
		return verified !== null
	}

	/**
	 * Gets the code corresponding to the provided `address`.
	 */
	async getAccount(address: EthjsAddress): Promise<EthjsAccount | undefined> {
		const elem = this._accountCache?.get(address)
		if (elem !== undefined) {
			return elem.accountRLP !== undefined
				? EthjsAccount.fromRlpSerializedAccount(elem.accountRLP)
				: undefined
		}
		const rlp = (await this.getAccountFromProvider(address)).serialize()
		const account =
			rlp !== null ? EthjsAccount.fromRlpSerializedAccount(rlp) : undefined
		if (account) {
			this._accountCache.put(address, account)
		}
		return account
	}

	/**
	 * Retrieves an account from the provider and stores in the local trie
	 * @param address Address of account to be retrieved from provider
	 * @private
	 */
	async getAccountFromProvider(address: EthjsAddress): Promise<EthjsAccount> {
		const accountData = await this.client.getProof({
			address: address.toString() as Address,
			storageKeys: [],
			...this._currentBlockTag,
		})
		const account = EthjsAccount.fromAccountData({
			balance: BigInt(accountData.balance),
			nonce: BigInt(accountData.nonce),
			codeHash: toBytes(accountData.codeHash),
			storageRoot: toBytes(accountData.storageHash),
		})
		return account
	}

	/**
	 * Saves an account into state under the provided `address`.
	 */
	async putAccount(
		address: EthjsAddress,
		account: EthjsAccount | undefined,
	): Promise<void> {
		if (account !== undefined) {
			this._accountCache?.put(address, account)
		} else {
			this._accountCache?.del(address)
		}
	}

	/**
	 * Gets the account associated with `address`, modifies the given account
	 * fields, then saves the account into state. Account fields can include
	 * `nonce`, `balance`, `storageRoot`, and `codeHash`.
	 * @param address - Address of the account to modify
	 * @param accountFields - Object containing account fields and values to modify
	 */
	async modifyAccountFields(
		address: EthjsAddress,
		accountFields: AccountFields,
	): Promise<void> {
		let account = await this.getAccount(address)
		if (!account) {
			account = new EthjsAccount()
		}
		account.nonce = accountFields.nonce ?? account.nonce
		account.balance = accountFields.balance ?? account.balance
		account.storageRoot = accountFields.storageRoot ?? account.storageRoot
		account.codeHash = accountFields.codeHash ?? account.codeHash
		await this.putAccount(address, account)
	}

	/**
	 * Deletes an account from state under the provided `address`.
	 * @param address - Address of the account which should be deleted
	 */
	async deleteAccount(address: EthjsAddress) {
		this._accountCache.del(address)
	}

	/**
	 * Get an EIP-1186 proof from the provider
	 * @param address address to get proof of
	 * @param storageSlots storage slots to get proof of
	 * @returns an EIP-1186 formatted proof
	 */
	async getProof(
		address: EthjsAddress,
		storageSlots: Uint8Array[] = [],
	): Promise<Proof> {
		const proof = await this.client.getProof({
			address: address.toString() as Address,
			storageKeys: storageSlots.map((slot) => bytesToHex(slot)),
			...this._currentBlockTag,
		})
		return {
			address: proof.address,
			accountProof: proof.accountProof,
			balance: toHex(proof.balance),
			codeHash: proof.codeHash,
			nonce: toHex(proof.nonce),
			storageHash: proof.storageHash,
			storageProof: proof.storageProof.map((p) => ({
				proof: p.proof,
				value: toHex(p.value),
				key: p.key,
			})),
		}
	}

	/**
	 * Checkpoints the current state of the StateManager instance.
	 * State changes that follow can then be committed by calling
	 * `commit` or `reverted` by calling rollback.
	 *
	 * Partial implementation, called from the subclass.
	 */
	async checkpoint(): Promise<void> {
		this._accountCache.checkpoint()
		this._storageCache.checkpoint()
	}

	/**
	 * Commits the current change-set to the instance since the
	 * last call to checkpoint.
	 *
	 * Partial implementation, called from the subclass.
	 */
	async commit(): Promise<void> {
		this._accountCache.commit()
		this._storageCache.commit()
		this.opts.onCommit?.(this)
	}

	/**
	 * Reverts the current change-set to the instance since the
	 * last call to checkpoint.
	 *
	 * Partial implementation , called from the subclass.
	 */
	async revert(): Promise<void> {
		this._accountCache.revert()
		this._storageCache.revert()
		this._contractCache.clear()
	}

	async flush(): Promise<void> {
		this._accountCache.flush()
	}

	/**
	 * @deprecated This method is not used by the Tevm State Manager and is a stub required by the State Manager interface
	 */
	getStateRoot = async () => {
		return new Uint8Array(32)
	}

	/**
	 * @deprecated This method is not used by the Tevm State Manager and is a stub required by the State Manager interface
	 */
	setStateRoot = async (_root: Uint8Array) => {}

	/**
	 * @deprecated This method is not used by the Tevm State Manager and is a stub required by the State Manager interface
	 */
	hasStateRoot = () => {
		throw new Error('function not implemented')
	}

	getAccountAddresses = () => {
		const accountAddresses: string[] = []
		//Tevm initializes stateManager account cache with an ordered map cache
		this._accountCache?._orderedMapCache?.forEach((e) => {
			accountAddresses.push(e[0])
		})

		return accountAddresses as Address[]
	}

	/**
	 * Loads a {@link TevmState} into the state manager
	 */
	generateCanonicalGenesis = async (state: TevmState): Promise<void> => {
		for (const [k, v] of Object.entries(state)) {
			const { nonce, balance, storageRoot, codeHash, storage } = v
			const account = new EthjsAccount(
				// replace with just the var
				nonce,
				balance,
				hexToBytes(storageRoot, { size: 32 }),
				hexToBytes(codeHash, { size: 32 }),
			)
			const address = EthjsAddress.fromString(k)
			this.putAccount(address, account)
			if (storage !== undefined) {
				for (const [storageKey, storageData] of Object.entries(storage)) {
					const key = hexToBytes(
						isHex(storageKey) ? storageKey : `0x${storageKey}`,
					)
					const data = hexToBytes(
						isHex(storageData) ? storageData : `0x${storageData}`,
					)
					this.putContractStorage(address, key, data)
				}
			}
		}
	}

	/**
	 * Dumps the state of the state manager as a {@link TevmState}
	 */
	dumpCanonicalGenesis = async (): Promise<TevmState> => {
		const accountAddresses: string[] = []
		this._accountCache?._orderedMapCache?.forEach((e) => {
			accountAddresses.push(e[0])
		})

		const state: TevmState = {}

		for (const address of accountAddresses) {
			const hexAddress = `0x${address}`
			const account = await this.getAccount(EthjsAddress.fromString(hexAddress))

			if (account !== undefined) {
				const storage = await this.dumpStorage(
					EthjsAddress.fromString(hexAddress),
				)

				state[hexAddress] = {
					...account,
					storageRoot: bytesToHex(account.storageRoot),
					codeHash: bytesToHex(account.codeHash),
					storage,
				}
			}
		}

		return state
	}
}
