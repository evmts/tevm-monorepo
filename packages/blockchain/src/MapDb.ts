// this type is from ethereumjs and not all options are guaranteed to be used
export type DbType =
	| 'Receipts'
	| 'TxHash'
	| 'SkeletonBlock'
	| 'SkeletonBlockHashToNumber'
	| 'SkeletonStatus'
	| 'SkeletonUnfinalizedBlockByHash'
	| 'Preimage'

export interface MetaDBManagerOptions {
	cache: Map<string | Uint8Array, Uint8Array>
}

/**
 * Helper class to access the metaDB with methods `put`, `get`, and `delete`
 */
export type MapDb = {
	put(type: DbType, hash: Uint8Array, value: Uint8Array): Promise<void>
	get(type: DbType, hash: Uint8Array): Promise<Uint8Array | null>
	delete(type: DbType, hash: Uint8Array): Promise<void>
}
