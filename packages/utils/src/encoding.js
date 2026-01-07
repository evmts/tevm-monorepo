/**
 * Native implementation of KeyEncoding and ValueEncoding enums
 * Migrated from @ethereumjs/util to remove dependency
 *
 * These enums are used for specifying key/value encoding types in database operations.
 * @module
 */

/**
 * Key encoding options for database operations
 * @readonly
 * @enum {string}
 */
export const KeyEncoding = /** @type {const} */ ({
	/** String encoding for keys */
	String: 'string',
	/** Bytes (Uint8Array view) encoding for keys */
	Bytes: 'view',
	/** Number encoding for keys */
	Number: 'number',
})

/**
 * Value encoding options for database operations
 * @readonly
 * @enum {string}
 */
export const ValueEncoding = /** @type {const} */ ({
	/** String encoding for values */
	String: 'string',
	/** Bytes (Uint8Array view) encoding for values */
	Bytes: 'view',
	/** JSON encoding for values */
	JSON: 'json',
})
