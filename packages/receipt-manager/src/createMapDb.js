// this is from ethereumjs and carries the same license as the original
// https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/execution/receipt.ts
import { concatBytes, hexToBytes, numberToHex, toHex } from '@tevm/utils'

/**
 * Mapping of database entry types to their numeric IDs for storage
 * Only append new items to the bottom of the list to remain backward compatible.
 * @type {Record<import('./MapDb.js').DbType, number>}
 */
export const typeToId = {
	Receipts: 0,
	TxHash: 1,
	SkeletonBlock: 2,
	SkeletonBlockHashToNumber: 3,
	SkeletonStatus: 4,
	SkeletonUnfinalizedBlockByHash: 5,
	Preimage: 6,
}

/**
 * Creates a MapDb which uses an in-memory map as its underlying data structure.
 * This implementation provides methods for storing, retrieving, and deleting
 * transaction receipts and other blockchain data.
 *
 * @param {object} options - The configuration options
 * @param {Map<import('@tevm/utils').Hex, Uint8Array>} options.cache - The cache map to use for storage
 * @returns {import('./MapDb.js').MapDb} A MapDb instance backed by the provided cache
 *
 * @example
 * import { createMapDb } from './createMapDb.js'
 *
 * const cache = new Map()
 * const mapDb = createMapDb({ cache })
 *
 * // Store a receipt
 * await mapDb.put('Receipts', blockHash, encodedReceipt)
 *
 * // Retrieve the receipt
 * const receipt = await mapDb.get('Receipts', blockHash)
 *
 * // Delete the receipt
 * await mapDb.delete('Receipts', blockHash)
 */
export const createMapDb = ({ cache }) => {
	/**
	 * Generates a database key by combining the type ID and the key
	 * @param {import('./MapDb.js').DbType} type - The type of database entry
	 * @param {Uint8Array} key - The key for the entry
	 * @returns {import('@tevm/utils').Hex} The combined database key as a hex string
	 * @private
	 */
	const dbKey = (type, key) => {
		// TODO add numberToBytes to utils
		return toHex(concatBytes(hexToBytes(numberToHex(typeToId[type])), key))
	}

	return {
		...{ _cache: cache },
		/**
		 * Store a value in the database
		 * @param {import('./MapDb.js').DbType} type - The type of data being stored
		 * @param {Uint8Array} hash - The hash key for the data
		 * @param {Uint8Array} value - The value to store
		 * @returns {Promise<void>}
		 */
		put(type, hash, value) {
			cache.set(dbKey(type, hash), value)
			return Promise.resolve()
		},

		/**
		 * Retrieve a value from the database
		 * @param {import('./MapDb.js').DbType} type - The type of data to retrieve
		 * @param {Uint8Array} hash - The hash key for the data
		 * @returns {Promise<Uint8Array | null>} The stored value or null if not found
		 */
		get(type, hash) {
			return Promise.resolve(cache.get(dbKey(type, hash)) ?? null)
		},

		/**
		 * Delete a value from the database
		 * @param {import('./MapDb.js').DbType} type - The type of data to delete
		 * @param {Uint8Array} hash - The hash key for the data to delete
		 * @returns {Promise<void>}
		 */
		delete(type, hash) {
			cache.delete(dbKey(type, hash))
			return Promise.resolve()
		},

		/**
		 * Create a deep copy of the MapDb instance with a new copy of the cache
		 * @returns {import('./MapDb.js').MapDb} A new MapDb instance with a copy of the data
		 */
		deepCopy() {
			return createMapDb({ cache: new Map(cache) })
		},
	}
}
