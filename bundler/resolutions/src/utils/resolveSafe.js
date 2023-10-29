import { ExistsSyncError, ReadFileError } from './safeFao.js'
import {
	async as effectAsync,
	fail,
	runPromise,
	runSync,
	succeed,
} from 'effect/Effect'
import resolve from 'resolve'

/**
 * Error thrown when resolve fails
 */
export class ResolveError extends Error {
	/**
	 * @type {'ResolveError'}
	 */
	_tag = 'ResolveError'
	/**
	 * @type {'ResolveError'}
	 * @override
	 */
	name = 'ResolveError'
	/**
	 * @param {Error} cause
	 */
	constructor(cause) {
		super('Failed to resolve', { cause })
	}
}

/**
 * @typedef {ResolveError|import("./safeFao.js").ReadFileError | import("./safeFao.js").ExistsSyncError} ResolveSafeError
 */

/**
 * import resolve from 'resolve wrapped in an effect
 * @param {string} filePath
 * @param {string} basedir
 * @param {import("./safeFao.js").SafeFao} fao
 * @returns {import("effect/Effect").Effect<never, ResolveSafeError, string>}
 * @example
 * ```ts
 * const pathToSolidity = path.join(__dirname, '../Contract.sol')
 * const formattedPath = formatPath(pathToSolidity)
 * console.log(formattedPath) // '/path/to/Contract.sol'
 * ```
 */
export const resolveSafe = (filePath, basedir, fao) => {
	return effectAsync((resume) => {
		resolve(
			filePath,
			{
				basedir,
				readFile: (file, cb) => {
					runPromise(fao.readFile(file, 'utf8'))
						.then((fileContent) => {
							cb(null, fileContent)
						})
						.catch((e) => {
							cb(e)
						})
				},
				isFile: (file, cb) => {
					try {
						cb(null, runSync(fao.existsSync(file)))
					} catch (e) {
						cb(/** @type {Error} */ (e))
					}
				},
			},
			(err, res) => {
				if (err) {
					const typedError =
						/** @type {import("./safeFao.js").ReadFileError | import("./safeFao.js").ExistsSyncError} */ (
							err
						)
					if (typedError.name === 'ExistsSyncError') {
						resume(fail(new ExistsSyncError(typedError)))
					} else if (typedError.name === 'ReadFileError') {
						resume(fail(new ReadFileError(typedError)))
					} else {
						resume(fail(new ResolveError(err)))
					}
				} else {
					resume(succeed(/** @type string */ (res))) // resume with a success effect when the operation succeeds
				}
			},
		)
	})
}
