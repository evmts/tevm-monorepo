import { try as trySync, tryPromise } from 'effect/Effect'

/**
 * @typedef {ReturnType<typeof safeFao>} SafeFao
 */

export class ReadFileError extends Error {
	/**
	 * @type {'ReadFileError'}
	 */
	_tag = 'ReadFileError'
	/**
	 * @type {'ReadFileError'}
	 * @override
	 */
	name = 'ReadFileError'
	/**
	 * @param {Error} cause
	 */
	constructor(cause) {
		super(`Read file error: ${cause.message}`, { cause })
	}
}

export class ExistsSyncError extends Error {
	/**
	 * @type {'ExistsSyncError'}
	 */
	_tag = 'ExistsSyncError'
	/**
	 * @type {'ExistsSyncError'}
	 * @override
	 */
	name = 'ExistsSyncError'
	/**
	 * @param {Error} cause
	 */
	constructor(cause) {
		super(`ExistsSync error: ${cause.message}`, { cause })
	}
}

/**
 * @param {import("../types.js").FileAccessObject} fao
 */
export const safeFao = (fao) => {
	return {
		/**
		 * @param {string} path
		 * @param {BufferEncoding} encoding
		 */
		readFile: (path, encoding) => {
			return tryPromise({
				try: () => {
					return fao.readFile(path, encoding)
				},
				catch: (e) => {
					return new ReadFileError(/** @type Error */ (e))
				},
			})
		},
		/**
		 * @param {string} path
		 * @param {BufferEncoding} encoding
		 */
		readFileSync: (path, encoding) => {
			return trySync({
				try: () => {
					return fao.readFileSync(path, encoding)
				},
				catch: (e) => {
					return new ReadFileError(/** @type Error */ (e))
				},
			})
		},
		/**
		 * @param {string} path
		 */
		existsSync: (path) => {
			return trySync({
				try: () => {
					return fao.existsSync(path)
				},
				catch: (e) => {
					return new ExistsSyncError(/** @type Error */ (e))
				},
			})
		},
	}
}
