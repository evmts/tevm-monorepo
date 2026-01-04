import type { AccountFields } from './AccountFields.js'
import type { StorageDump } from './StorageDump.js'
import type { StorageRange } from './StorageRange.js'

/**
 * Represents an Ethereum account with nonce, balance, storageRoot, and codeHash.
 * This is a minimal interface for the Account class used in the state manager.
 */
export interface AccountInterface {
	nonce: bigint
	balance: bigint
	storageRoot: Uint8Array
	codeHash: Uint8Array
	codeSize?: number
}

/**
 * Represents an Ethereum address as a class with a bytes property.
 * This is a minimal interface for the Address class used in the state manager.
 */
export interface AddressInterface {
	bytes: Uint8Array
	toString(): string
	equals(address: AddressInterface): boolean
	isZero(): boolean
}

/**
 * Base interface for EVM state managers.
 * This interface provides the core methods needed for EVM execution to interact with state.
 *
 * @example
 * ```typescript
 * import type { EvmStateManagerInterface } from '@tevm/common'
 *
 * async function checkBalance(stateManager: EvmStateManagerInterface, address: AddressInterface) {
 *   const account = await stateManager.getAccount(address)
 *   return account?.balance ?? 0n
 * }
 * ```
 */
export interface EvmStateManagerInterface {
	/**
	 * Gets the account associated with `address`.
	 * Returns an empty account if the account does not exist.
	 * @param address - Address of the account to get
	 */
	getAccount(address: AddressInterface): Promise<AccountInterface | undefined>

	/**
	 * Saves an account into state under the provided `address`.
	 * @param address - Address under which to store account
	 * @param account - The account to store (or undefined to delete)
	 */
	putAccount(address: AddressInterface, account?: AccountInterface): Promise<void>

	/**
	 * Deletes an account from state under the provided `address`.
	 * @param address - Address of the account to delete
	 */
	deleteAccount(address: AddressInterface): Promise<void>

	/**
	 * Modifies specific fields of an account without replacing it entirely.
	 * @param address - Address of the account to modify
	 * @param accountFields - The fields to update
	 */
	modifyAccountFields(address: AddressInterface, accountFields: AccountFields): Promise<void>

	/**
	 * Stores contract code for an address.
	 * @param address - Address of the account to add the code for
	 * @param value - The code bytes
	 */
	putCode(address: AddressInterface, value: Uint8Array): Promise<void>

	/**
	 * Gets the code for an account.
	 * @param address - Address to get the code for
	 * @returns The code bytes or empty Uint8Array if no code
	 */
	getCode(address: AddressInterface): Promise<Uint8Array>

	/**
	 * Gets the code size for an account.
	 * @param address - Address to get the code size for
	 * @returns The size of the code in bytes
	 */
	getCodeSize(address: AddressInterface): Promise<number>

	/**
	 * Gets the storage value at the provided `address` and `key`.
	 * @param address - Address of the account to get storage for
	 * @param key - Key in the account's storage
	 * @returns Storage value or empty array if not set
	 */
	getStorage(address: AddressInterface, key: Uint8Array): Promise<Uint8Array>

	/**
	 * Adds a value to the account's storage.
	 * @param address - Address of the account
	 * @param key - Key to set storage value for
	 * @param value - Value to set
	 */
	putStorage(address: AddressInterface, key: Uint8Array, value: Uint8Array): Promise<void>

	/**
	 * Clears all storage entries for the account corresponding to `address`.
	 * @param address - Address to clear storage for
	 */
	clearStorage(address: AddressInterface): Promise<void>

	/**
	 * Checkpoints the current state of the StateManager.
	 * State changes that follow can be reverted or committed.
	 */
	checkpoint(): Promise<void>

	/**
	 * Commits the current state checkpoint to the StateManager.
	 * Pending changes are made final.
	 */
	commit(): Promise<void>

	/**
	 * Reverts the current state checkpoint to the state marked
	 * by the previous call to checkpoint.
	 */
	revert(): Promise<void>

	/**
	 * Gets the state-root of the Merkle-Patricia trie.
	 * @returns The state root as a Uint8Array
	 */
	getStateRoot(): Promise<Uint8Array>

	/**
	 * Sets the state-root of the Merkle-Patricia trie.
	 * @param stateRoot - The state root to set
	 * @param clearCache - Whether to clear the internal caches
	 */
	setStateRoot(stateRoot: Uint8Array, clearCache?: boolean): Promise<void>

	/**
	 * Checks if the `account` corresponding to `address` is empty.
	 * @param root - Root of the state trie
	 * @returns Whether the state root exists
	 */
	hasStateRoot(root: Uint8Array): Promise<boolean>

	/**
	 * Dumps the complete storage for address.
	 * @param address - Address to dump storage for
	 */
	dumpStorage?(address: AddressInterface): Promise<StorageDump>

	/**
	 * Dumps a range of storage values for address.
	 * @param address - Address to dump storage for
	 * @param startKey - Start key for the range
	 * @param limit - Number of entries to return
	 */
	dumpStorageRange?(address: AddressInterface, startKey: bigint, limit: number): Promise<StorageRange>

	/**
	 * Cache to lookup the storage value from the original storage
	 * (i.e. the storage before any changes are applied).
	 */
	originalStorageCache: {
		get(address: AddressInterface, key: Uint8Array): Promise<Uint8Array>
		clear(): void
	}

	/**
	 * Generates canonical genesis state.
	 * @param initState - Genesis state to load
	 */
	generateCanonicalGenesis?(initState: unknown): Promise<void>

	/**
	 * Gets the applied key if relevant (for Verkle trees).
	 * @param address - Address bytes
	 */
	getAppliedKey?(address: Uint8Array): Uint8Array

	/**
	 * Clears all internal caches.
	 */
	clearCaches(): void

	/**
	 * Returns a shallow copy of the state manager.
	 * @param downlevelCaches - Whether to downlevel caches
	 */
	shallowCopy(downlevelCaches?: boolean): EvmStateManagerInterface
}
