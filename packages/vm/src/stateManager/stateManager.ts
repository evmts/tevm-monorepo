// This file has the same license as ethereumjs monorepo while it is still using ethers js to implement the state manager
// It' currently copied from https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/originalStorageCache.ts
// We want to reimplement this interface with viem
// We will need to heavily customize this for EVMts to read from aconfigurable EVMts store
import { Trie } from '@ethereumjs/trie'
import {
	Account,
	bigIntToHex,
	bytesToBigInt,
	bytesToHex,
	toBytes,
} from '@ethereumjs/util'
import debugDefault from 'debug'
import { keccak256 } from 'ethereum-cryptography/keccak.js'
import { ethers } from 'ethers'

import { AccountCache, CacheType, StorageCache } from '@ethereumjs/statemanager'

import type {
	AccountFields,
	EVMStateManagerInterface,
	StorageDump,
} from '@ethereumjs/common'
import type { StorageRange } from '@ethereumjs/common'
import type { Proof } from '@ethereumjs/statemanager'
import type { Debugger } from 'debug'

import { bytesToUnprefixedHex } from '@ethereumjs/util'
import type { Address } from '@ethereumjs/util'

type getContractStorage = (
	address: Address,
	key: Uint8Array,
) => Promise<Uint8Array>

class OriginalStorageCache {
	private map: Map<string, Map<string, Uint8Array>>
	private getContractStorage: getContractStorage
	constructor(getContractStorage: getContractStorage) {
		this.map = new Map()
		this.getContractStorage = getContractStorage
	}

	async get(address: Address, key: Uint8Array): Promise<Uint8Array> {
		const addressHex = bytesToUnprefixedHex(address.bytes)
		const map = this.map.get(addressHex)
		if (map !== undefined) {
			const keyHex = bytesToUnprefixedHex(key)
			const value = map.get(keyHex)
			if (value !== undefined) {
				return value
			}
		}
		const value = await this.getContractStorage(address, key)
		this.put(address, key, value)
		return value
	}

	put(address: Address, key: Uint8Array, value: Uint8Array) {
		const addressHex = bytesToUnprefixedHex(address.bytes)
		let map = this.map.get(addressHex)
		if (map === undefined) {
			map = new Map()
			this.map.set(addressHex, map)
		}
		const keyHex = bytesToUnprefixedHex(key)
		if (map?.has(keyHex) === false) {
			map?.set(keyHex, value)
		}
	}

	clear(): void {
		this.map = new Map()
	}
}
const { debug: createDebugLogger } = debugDefault

export interface EthersStateManagerOpts {
	provider: string | ethers.JsonRpcProvider
	blockTag: bigint | 'earliest'
}

export class EthersStateManager implements EVMStateManagerInterface {
	protected _provider: ethers.JsonRpcProvider
	protected _contractCache: Map<string, Uint8Array>
	protected _storageCache: StorageCache
	protected _blockTag: string
	protected _accountCache: AccountCache
	originalStorageCache: OriginalStorageCache
	protected _debug: Debugger
	protected DEBUG: boolean
	constructor(opts: EthersStateManagerOpts) {
		// TODO make this configurable
		this.DEBUG = false

		this._debug = createDebugLogger('statemanager:ethersStateManager')
		if (typeof opts.provider === 'string') {
			this._provider = new ethers.JsonRpcProvider(opts.provider)
		} else if (opts.provider instanceof ethers.JsonRpcProvider) {
			this._provider = opts.provider
		} else {
			throw new Error(
				`valid JsonRpcProvider or url required; got ${opts.provider}`,
			)
		}

		this._blockTag =
			opts.blockTag === 'earliest' ? opts.blockTag : bigIntToHex(opts.blockTag)

		this._contractCache = new Map()
		this._storageCache = new StorageCache({
			size: 100000,
			type: CacheType.ORDERED_MAP,
		})
		this._accountCache = new AccountCache({
			size: 100000,
			type: CacheType.ORDERED_MAP,
		})

		this.originalStorageCache = new OriginalStorageCache(
			this.getContractStorage.bind(this),
		)
	}

	/**
	 * Note that the returned statemanager will share the same JsonRpcProvider as the original
	 *
	 * @returns EthersStateManager
	 */
	shallowCopy(): EthersStateManager {
		const newState = new EthersStateManager({
			provider: this._provider,
			blockTag: BigInt(this._blockTag),
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
	 * Sets the new block tag used when querying the provider and clears the
	 * internal cache.
	 * @param blockTag - the new block tag to use when querying the provider
	 */
	setBlockTag(blockTag: bigint | 'earliest'): void {
		this._blockTag = blockTag === 'earliest' ? blockTag : bigIntToHex(blockTag)
		this.clearCaches()
		if (this.DEBUG) this._debug(`setting block tag to ${this._blockTag}`)
	}

	/**
	 * Clears the internal cache so all accounts, contract code, and storage slots will
	 * initially be retrieved from the provider
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
	async getContractCode(address: Address): Promise<Uint8Array> {
		let codeBytes = this._contractCache.get(address.toString())
		if (codeBytes !== undefined) return codeBytes
		const code = await this._provider.getCode(
			address.toString(),
			this._blockTag,
		)
		codeBytes = toBytes(code)
		this._contractCache.set(address.toString(), codeBytes)
		return codeBytes
	}

	/**
	 * Adds `value` to the state trie as code, and sets `codeHash` on the account
	 * corresponding to `address` to reference this.
	 * @param address - Address of the `account` to add the `code` for
	 * @param value - The value of the `code`
	 */
	async putContractCode(address: Address, value: Uint8Array): Promise<void> {
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
		address: Address,
		key: Uint8Array,
	): Promise<Uint8Array> {
		// Check storage slot in cache
		if (key.length !== 32) {
			throw new Error('Storage key must be 32 bytes long')
		}

		let value = this._storageCache?.get(address, key)
		if (value !== undefined) {
			return value
		}

		// Retrieve storage slot from provider if not found in cache
		const storage = await this._provider.getStorage(
			address.toString(),
			bytesToBigInt(key),
			this._blockTag,
		)
		value = toBytes(storage)

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
		address: Address,
		key: Uint8Array,
		value: Uint8Array,
	): Promise<void> {
		this._storageCache.put(address, key, value)
	}

	/**
	 * Clears all storage entries for the account corresponding to `address`.
	 * @param address - Address to clear the storage of
	 */
	async clearContractStorage(address: Address): Promise<void> {
		this._storageCache.clearContractStorage(address)
	}

	/**
	 * Dumps the RLP-encoded storage values for an `account` specified by `address`.
	 * @param address - The address of the `account` to return storage for
	 * @returns {Promise<StorageDump>} - The state of the account as an `Object` map.
	 * Keys are the storage keys, values are the storage values as strings.
	 * Both are represented as `0x` prefixed hex strings.
	 */
	dumpStorage(address: Address): Promise<StorageDump> {
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
		_address: Address,
		_startKey: bigint,
		_limit: number,
	): Promise<StorageRange> {
		// TODO: Implement.
		return Promise.reject()
	}

	/**
	 * Checks if an `account` exists at `address`
	 * @param address - Address of the `account` to check
	 */
	async accountExists(address: Address): Promise<boolean> {
		if (this.DEBUG) this._debug?.(`verify if ${address.toString()} exists`)

		const localAccount = this._accountCache.get(address)
		if (localAccount !== undefined) return true
		// Get merkle proof for `address` from provider
		const proof = await this._provider.send('eth_getProof', [
			address.toString(),
			[],
			this._blockTag,
		])

		const proofBuf = proof.accountProof.map((proofNode: string) =>
			toBytes(proofNode),
		)

		const trie = new Trie({ useKeyHashing: true })
		const verified = await trie.verifyProof(
			keccak256(proofBuf[0]),
			address.bytes,
			proofBuf,
		)
		// if not verified (i.e. verifyProof returns null), account does not exist
		return verified === null ? false : true
	}

	/**
	 * Gets the code corresponding to the provided `address`.
	 * @param address - Address to get the `account` for
	 * @returns {Promise<Uint8Array>} - Resolves with the code corresponding to the provided address.
	 * Returns an empty `Uint8Array` if the account has no associated code.
	 */
	async getAccount(address: Address): Promise<Account | undefined> {
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
	async getAccountFromProvider(address: Address): Promise<Account> {
		if (this.DEBUG)
			this._debug(
				`retrieving account data from ${address.toString()} from provider`,
			)
		const accountData = await this._provider.send('eth_getProof', [
			address.toString(),
			[],
			this._blockTag,
		])
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
	 * @param address - Address under which to store `account`
	 * @param account - The account to store
	 */
	async putAccount(
		address: Address,
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
		address: Address,
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
	async deleteAccount(address: Address) {
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
		address: Address,
		storageSlots: Uint8Array[] = [],
	): Promise<Proof> {
		if (this.DEBUG)
			this._debug(`retrieving proof from provider for ${address.toString()}`)
		const proof = await this._provider.send('eth_getProof', [
			address.toString(),
			[storageSlots.map((slot) => bytesToHex(slot))],
			this._blockTag,
		])

		return proof
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
		// setup cache checkpointing
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
	 * @deprecated This method is not used by the Ethers State Manager and is a stub required by the State Manager interface
	 */
	getStateRoot = async () => {
		return new Uint8Array(32)
	}

	/**
	 * @deprecated This method is not used by the Ethers State Manager and is a stub required by the State Manager interface
	 */
	setStateRoot = async (_root: Uint8Array) => {}

	/**
	 * @deprecated This method is not used by the Ethers State Manager and is a stub required by the State Manager interface
	 */
	hasStateRoot = () => {
		throw new Error('function not implemented')
	}

	generateCanonicalGenesis(_initState: any): Promise<void> {
		return Promise.resolve()
	}
}
