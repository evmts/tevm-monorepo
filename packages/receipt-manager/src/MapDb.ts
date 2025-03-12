import type { Hex } from '@tevm/utils'

// this type is from ethereumjs and not all options are guaranteed to be used
/**
 * Types of database entries used by the receipt manager and other components
 */
export type DbType =
	| 'Receipts'
	| 'TxHash'
	| 'SkeletonBlock'
	| 'SkeletonBlockHashToNumber'
	| 'SkeletonStatus'
	| 'SkeletonUnfinalizedBlockByHash'
	| 'Preimage'

/**
 * Options for creating a MapDb instance
 */
export interface MetaDBManagerOptions {
	/**
	 * Map used as the cache for the database
	 */
	cache: Map<Hex, Uint8Array>
}

/**
 * Helper class to access the metaDB with methods for managing receipts and transaction data
 */
export type MapDb = {
	/**
	 * Store a value in the database
	 * @param type - The type of data being stored
	 * @param hash - The hash key for the data
	 * @param value - The value to store
	 */
	put(type: DbType, hash: Uint8Array, value: Uint8Array): Promise<void>

	/**
	 * Retrieve a value from the database
	 * @param type - The type of data to retrieve
	 * @param hash - The hash key for the data
	 * @returns The stored value or null if not found
	 */
	get(type: DbType, hash: Uint8Array): Promise<Uint8Array | null>

	/**
	 * Delete a value from the database
	 * @param type - The type of data to delete
	 * @param hash - The hash key for the data to delete
	 */
	delete(type: DbType, hash: Uint8Array): Promise<void>

	/**
	 * Create a deep copy of the MapDb instance
	 * @returns A new MapDb instance with a copy of the data
	 */
	deepCopy(): MapDb
}
