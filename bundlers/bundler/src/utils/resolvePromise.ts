import { type FileAccessObject, type Logger } from '../types.js'
import { Effect } from 'effect'
import resolve from 'resolve'

export const resolveEffect = (
	filePath: string,
	basedir: string,
	fao: FileAccessObject,
	logger: Logger,
): Effect.Effect<never, Error, string> => {
	return Effect.async<never, Error, string>((resume) => {
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
						cb(e as Error)
						logger.error(e as any)
						logger.error(`Error checking if isFile ${file}`)
						resume(Effect.fail(e as Error)) // resume with a failure effect when error occurs
						return
					}
				},
			},
			(err, res) => {
				if (err) {
					logger.error(err as any)
					logger.error(`There was an error resolving ${filePath}`)
					resume(Effect.fail(err)) // resume with a failure effect when error occurs
				} else {
					resume(Effect.succeed(res as string)) // resume with a success effect when the operation succeeds
				}
			},
		)
	})
}
