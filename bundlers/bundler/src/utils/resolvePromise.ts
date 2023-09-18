import type { FileAccessObject, Logger } from '../types'
import resolve from 'resolve'

export const resolvePromise = (
	filePath: string,
	basedir: string,
	fao: FileAccessObject,
	logger: Logger,
): Promise<string> => {
	return new Promise<string>((promiseResolve, promiseReject) => {
		resolve(
			filePath,
			{
				basedir,
				readFile: (file, cb) => {
					fao
						.readFile(file, 'utf8')
						.then((file) => {
							cb(null, file)
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
						throw e
					}
				},
			},
			(err, res) => {
				if (err) {
					logger.error(err as any)
					logger.error(`there was an error resolving ${filePath}`)
					promiseReject(err)
				} else {
					promiseResolve(res as string)
				}
			},
		)
	})
}
