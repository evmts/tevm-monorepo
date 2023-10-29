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
 * Turns a file access object into a safe file access object that returns effects
 * @param {import("../types.js").FileAccessObject} fao
 * @example
 * ```ts
 * const fao = {
 *   	readFile: readFile,
 * 		readFileSync: readFileSync,
 *		existsSync: existsSync,
 * }
 * const safeFao = safeFao(fao)
 * safeFao.readFileSync('path/to/file', 'utf8') .pipe(
 *   tap((fileContent) => console.log(fileContent)),
 * )
 * ```
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
