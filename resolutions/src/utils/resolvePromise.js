import { Effect } from 'effect'
import resolve from 'resolve'

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
		super("Couldn't read file", { cause })
	}
}

export class IsFileError extends Error {
	/**
	 * @type {'IsFileError'}
	 */
	_tag = 'IsFileError'
	/**
	 * @type {'IsFileError'}
	 * @override
	 */
	name = 'IsFileError'
	/**
	 * @param {Error} cause
	 */
	constructor(cause) {
		super("Error thrown checking for file existence", { cause })
	}
}

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
		super("Failed to resolve", { cause })
	}
}

/**
 * import resolve from 'resolve wrapped in an effect
 * @param {string} filePath
 * @param {string} basedir
 * @param {import("../types.js").FileAccessObject} fao
 * @returns {Effect.Effect<never, Error, string>}
 */
export const resolveEffect = (filePath, basedir, fao) => {
	return Effect.async((resume) => {
		resolve(
			filePath,
			{
				basedir,
				readFile: (file, cb) => {
					fao
						.readFile(file, 'utf8')
						.then((fileContent) => {
							cb(null, fileContent)
						})
						.catch((e) => {
							cb(new ReadFileError(e))
							resume(Effect.fail(new ReadFileError(e)))
							throw e
						})
				},
				isFile: (file, cb) => {
					try {
						cb(null, fao.existsSync(file))
					} catch (e) {
						cb(/** @type Error */(e))
						resume(Effect.fail(/** @type Error */(e))) // resume with a failure effect when error occurs
						throw e
					}
				},
			},
			(err, res) => {
				if (err) {
					if ('_tag' in err && err._tag === 'ReadFileError') {
						resume(Effect.fail(err))
					}
					if ('_tag' in err && err._tag === 'IsFileError') {
						resume(Effect.fail(err))
					}
					resume(Effect.fail(new ResolveError(err)))
				} else {
					if (res === undefined) {
						resume(Effect.fail(new ResolveError(new Error('Resolved undefined'))))
					}
					resume(Effect.succeed(/** @type string */(res))) // resume with a success effect when the operation succeeds
				}
			},
		)
	})
}
