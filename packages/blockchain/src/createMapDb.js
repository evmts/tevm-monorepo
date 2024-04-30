// this is from ethereumjs and carries the same license as the original
// https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/execution/receipt.ts
import { concatBytes, hexToBytes, numberToHex } from '@tevm/utils'

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
 * @param {import('./MapDb.js').MetaDBManagerOptions} options
 * @returns {import('./MapDb.js').MapDb}
 */
export const createMapDb = ({ cache }) => {
	/**
	 * @param {import('./MapDb.js').DbType} type
	 * @param {Uint8Array} key
	 * @returns {Uint8Array}
	 */
	const dbKey = (type, key) => {
		// TODO add numberToBytes to utils
		return concatBytes(hexToBytes(numberToHex(typeToId[type])), key)
	}

	return {
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
	}
}
