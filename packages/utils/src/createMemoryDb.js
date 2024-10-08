import { UnreachableCodeError } from '@tevm/errors'
import { bytesToHex } from './viem.js'

/**
 * Converts key to type that maps can use as keys
 * @param {unknown} bytes
 */
const encodeKey = (bytes) => {
	if (bytes instanceof Uint8Array) {
		return bytesToHex(bytes)
	}
	return bytes
}

/**
 * @internal
 * A simple ethereumjs DB instance that uses an in memory Map as it's backend
 * Pass in an initial DB optionally to prepoulate the DB.
 * @type {import('./CreateMemoryDbFn.js').CreateMemoryDbFn}
 * @throws {never}
 */
export const createMemoryDb = (initialDb) => {
	const db = initialDb ?? new Map()

	return {
		get: (key) => {
			return Promise.resolve(db.get(encodeKey(key)))
		},
		put: (key, value) => {
			db.set(encodeKey(key), value)
			return Promise.resolve()
		},
		del: (key) => {
			db.delete(encodeKey(key))
			return Promise.resolve()
		},
		shallowCopy: () => {
			return createMemoryDb(new Map(db))
		},
		// For compatability
		open: () => Promise.resolve(),
		batch: (stack) => {
			for (const item of stack) {
				if (item.type === 'del') {
					db.delete(encodeKey(item.key))
				} else if (item.type === 'put') {
					db.set(encodeKey(item.key), item.value)
				} else {
					return Promise.reject(new UnreachableCodeError(item))
				}
			}
			return Promise.resolve()
		},
	}
}
