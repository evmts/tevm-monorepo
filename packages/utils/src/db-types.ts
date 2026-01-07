/**
 * Native DB type definitions for tevm, replacing @ethereumjs/util DB types.
 * These types are used for key-value database operations.
 */

/**
 * Database object type for JSON value storage
 */
export type DBObject = {
	[key: string]: string | string[] | number
}

/**
 * Batch operation type for database operations
 */
export type BatchDBOp<
	TKey extends Uint8Array | string | number = Uint8Array,
	TValue extends Uint8Array | string | DBObject = Uint8Array,
> = PutBatch<TKey, TValue> | DelBatch<TKey>

/**
 * Key encoding options
 */
export type KeyEncoding = (typeof KeyEncoding)[keyof typeof KeyEncoding]
export const KeyEncoding = {
	String: 'string',
	Bytes: 'view',
	Number: 'number',
} as const

/**
 * Value encoding options
 */
export type ValueEncoding = (typeof ValueEncoding)[keyof typeof ValueEncoding]
export const ValueEncoding = {
	String: 'string',
	Bytes: 'view',
	JSON: 'json',
} as const

/**
 * Encoding options for DB operations
 */
export type EncodingOpts = {
	keyEncoding?: KeyEncoding
	valueEncoding?: ValueEncoding
}

/**
 * Put batch operation
 */
export interface PutBatch<
	TKey extends Uint8Array | string | number = Uint8Array,
	TValue extends Uint8Array | string | DBObject = Uint8Array,
> {
	type: 'put'
	key: TKey
	value: TValue
	opts?: EncodingOpts
}

/**
 * Delete batch operation
 */
export interface DelBatch<TKey extends Uint8Array | string | number = Uint8Array> {
	type: 'del'
	key: TKey
	opts?: EncodingOpts
}

/**
 * Database interface for key-value storage
 */
export interface DB<
	TKey extends Uint8Array | string | number = Uint8Array,
	TValue extends Uint8Array | string | DBObject = Uint8Array,
> {
	/**
	 * Retrieves a raw value from db.
	 * @param key
	 * @returns A Promise that resolves to `TValue` if a value is found or `undefined` if no value is found.
	 */
	get(key: TKey, opts?: EncodingOpts): Promise<TValue | undefined>

	/**
	 * Writes a value directly to db.
	 * @param key The key as a `TKey`
	 * @param value The value to be stored
	 */
	put(key: TKey, val: TValue, opts?: EncodingOpts): Promise<void>

	/**
	 * Removes a raw value in the underlying db.
	 * @param key
	 */
	del(key: TKey, opts?: EncodingOpts): Promise<void>

	/**
	 * Performs a batch operation on db.
	 * @param opStack A stack of levelup operations
	 */
	batch(opStack: BatchDBOp<TKey, TValue>[]): Promise<void>

	/**
	 * Returns a copy of the DB instance, with a reference
	 * to the **same** underlying db instance.
	 */
	shallowCopy(): DB<TKey, TValue>

	/**
	 * Opens the database -- if applicable
	 */
	open(): Promise<void>
}
