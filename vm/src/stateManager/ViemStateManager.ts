import { Trie } from '@ethereumjs/trie'
import { Account } from '@ethereumjs/util'
import debugDefault from 'debug'
import { keccak256 } from 'ethereum-cryptography/keccak.js'

import { AccountCache, CacheType, StorageCache } from '@ethereumjs/statemanager'

import { Cache } from './Cache.js'
import type {
	AccountFields,
	EVMStateManagerInterface,
	StorageDump,
} from '@ethereumjs/common'
import type { StorageRange } from '@ethereumjs/common'
import type { Proof } from '@ethereumjs/statemanager'
import type { Address as EthjsAddress } from '@ethereumjs/util'
import type { Address } from 'abitype'
import type { Debugger } from 'debug'
import {
	type BlockTag,
	type PublicClient,
	bytesToHex,
	hexToBytes,
	toBytes,
	toHex,
} from 'viem'

const { debug: createDebugLogger } = debugDefault

export interface ViemStateManagerOpts {
	client: PublicClient
	blockTag: bigint | 'earliest'
}

/**
 * A state manager that will fetch state from rpc using a viem public client and cache it for
 *f future requests
 */
export class ViemStateManager implements EVMStateManagerInterface {
	protected _contractCache: Map<string, Uint8Array>
	protected _storageCache: StorageCache
	protected _blockTag: { blockTag: BlockTag } | { blockNumber: bigint }
	protected _accountCache: AccountCache
	originalStorageCache: Cache
	protected _debug: Debugger
	protected DEBUG: boolean
	protected client: PublicClient
	constructor(opts: ViemStateManagerOpts) {
		this.DEBUG = false

		this.client = opts.client
		this._debug = createDebugLogger('statemanager:viemStateManager')
		this._blockTag =
			opts.blockTag === 'earliest'
				? { blockTag: opts.blockTag }
				: { blockNumber: opts.blockTag }

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
	}

	/**
	 * Returns a new instance of the ViemStateManager with the same opts
	 */
	shallowCopy(): ViemStateManager {
		const newState = new ViemStateManager({
			client: this.client,
			blockTag: Object.values(this._blockTag)[0],
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

	/**
	 * Sets the new block tag and clears the internal cache
	 */
	setBlockTag(blockTag: bigint | 'earliest'): void {
		this._blockTag =
			blockTag === 'earliest' ? { blockTag } : { blockNumber: blockTag }
		this.clearCaches()
		if (this.DEBUG) {
			this._debug(`setting block tag to ${this._blockTag}`)
		}
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
			...this._blockTag,
		})
		codeBytes = hexToBytes(code ?? '0x0')
		this._contractCache.set(address.toString(), codeBytes)
		return codeBytes
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

		const cachedValue = this._storageCache?.get(address, key)
		if (cachedValue !== undefined) {
			return cachedValue
		}

		const storage = await this.client.getStorageAt({
			address: address.toString() as Address,
			slot: bytesToHex(key),
			...this._blockTag,
		})
		const value = hexToBytes(storage ?? '0x0')

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
		if (this.DEBUG) this._debug?.(`verify if ${address.toString()} exists`)
		const localAccount = this._accountCache.get(address)
		if (localAccount !== undefined) return true
		const proof = await this.client.getProof({
			address: address.toString() as Address,
			storageKeys: [],
			...this._blockTag,
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
	async getAccount(address: EthjsAddress): Promise<Account | undefined> {
		const elem = this._accountCache?.get(address)
		if (elem !== undefined) {
			return elem.accountRLP !== undefined
				? Account.fromRlpSerializedAccount(elem.accountRLP)
				: undefined
		}
		const rlp = (await this.getAccountFromProvider(address)).serialize()
		const account =
			rlp !== null ? Account.fromRlpSerializedAccount(rlp) : undefined
		this._accountCache?.put(address, account)
		return account
	}

	/**
	 * Retrieves an account from the provider and stores in the local trie
	 * @param address Address of account to be retrieved from provider
	 * @private
	 */
	async getAccountFromProvider(address: EthjsAddress): Promise<Account> {
		if (this.DEBUG)
			this._debug(
				`retrieving account data from ${address.toString()} from provider`,
			)
		const accountData = await this.client.getProof({
			address: address.toString() as Address,
			storageKeys: [],
			...this._blockTag,
		})
		const account = Account.fromAccountData({
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
		account: Account | undefined,
	): Promise<void> {
		if (this.DEBUG) {
			this._debug(
				`Save account address=${address} nonce=${account?.nonce} balance=${
					account?.balance
				} contract=${account?.isContract() ? 'yes' : 'no'} empty=${
					account?.isEmpty() ? 'yes' : 'no'
				}`,
			)
		}
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
		if (this.DEBUG) {
			this._debug(`modifying account fields for ${address.toString()}`)
			this._debug(
				JSON.stringify(
					accountFields,
					(k, v) => {
						if (k === 'nonce') return v.toString()
						return v
					},
					2,
				),
			)
		}
		let account = await this.getAccount(address)
		if (!account) {
			account = new Account()
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
		if (this.DEBUG) {
			this._debug(`deleting account corresponding to ${address.toString()}`)
		}
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
		if (this.DEBUG)
			this._debug(`retrieving proof from provider for ${address.toString()}`)
		const proof = await this.client.getProof({
			address: address.toString() as Address,
			storageKeys: storageSlots.map((slot) => bytesToHex(slot)),
			...this._blockTag,
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
	 * @deprecated This method is not used by the Viem State Manager and is a stub required by the State Manager interface
	 */
	getStateRoot = async () => {
		return new Uint8Array(32)
	}

	/**
	 * @deprecated This method is not used by the Viem State Manager and is a stub required by the State Manager interface
	 */
	setStateRoot = async (_root: Uint8Array) => {}

	/**
	 * @deprecated This method is not used by the Viem State Manager and is a stub required by the State Manager interface
	 */
	hasStateRoot = () => {
		throw new Error('function not implemented')
	}

	generateCanonicalGenesis(_initState: any): Promise<void> {
		return Promise.resolve()
	}
}
