// this is from ethereumjs and carries the same license as the original
// https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/execution/receipt.ts
import { concatBytes, hexToBytes, numberToHex, toHex } from '@tevm/utils'

/**
 * Only append new items to the bottom of the list to
 * remain backward compat.
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
 * Creates a {MapDb} which uses an in memory map as it's underlying data structure
 * @param {import('./MapDb.js').MetaDBManagerOptions} options
 * @returns {import('./MapDb.js').MapDb}
 */
export const createMapDb = ({ cache }) => {
	/**
	 * @param {import('./MapDb.js').DbType} type
	 * @param {Uint8Array} key
	 * @returns {import('@tevm/utils').Hex}
	 */
	const dbKey = (type, key) => {
		// TODO add numberToBytes to utils
		return toHex(concatBytes(hexToBytes(numberToHex(typeToId[type])), key))
	}

	return {
		...{ _cache: cache },
		put(type, hash, value) {
			cache.set(dbKey(type, hash), value)
			return Promise.resolve()
		},
		get(type, hash) {
			return Promise.resolve(cache.get(dbKey(type, hash)) ?? null)
		},
		delete(type, hash) {
			cache.delete(dbKey(type, hash))
			return Promise.resolve()
		},
		deepCopy() {
			return createMapDb({ cache: new Map(cache) })
		},
	}
}
