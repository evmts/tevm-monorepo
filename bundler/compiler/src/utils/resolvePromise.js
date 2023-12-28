import { Effect } from 'effect'
import resolve from 'resolve'

/**
 * import resolve from 'resolve wrapped in an effect
 * @param {string} filePath
 * @param {string} basedir
 * @param {import("../types.js").FileAccessObject} fao
 * @param {import("../types.js").Logger} logger
 * @returns {Effect.Effect<never, Error, string>}
 */
export const resolveEffect = (filePath, basedir, fao, logger) => {
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
							logger.error(e)
							logger.error('Error reading file')
							cb(e)
						})
				},
				isFile: (file, cb) => {
					try {
						cb(null, fao.existsSync(file))
					} catch (e) {
						cb(/** @type Error */ (e))
						logger.error(/** @type any */ (e))
						logger.error(`Error checking if isFile ${file}`)
						resume(Effect.fail(/** @type Error */ (e))) // resume with a failure effect when error occurs
						return
					}
				},
			},
			(err, res) => {
				if (err) {
					logger.error(/** @type any */ (err))
					logger.error(`There was an error resolving ${filePath}`)
					resume(Effect.fail(err)) // resume with a failure effect when error occurs
				} else {
					resume(Effect.succeed(/** @type string */ (res))) // resume with a success effect when the operation succeeds
				}
			},
		)
	})
}
