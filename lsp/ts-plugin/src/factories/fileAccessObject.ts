import { FileAccessObject } from '@tevm/base'
import typescript from 'typescript/lib/tsserverlibrary.js'

export const createFileAccessObject = (
	lsHost: typescript.LanguageServiceHost,
): FileAccessObject => {
	return {
		readFile: async (fileName, encoding) => {
			const file = lsHost.readFile(fileName, encoding)
			if (!file) {
				throw new Error(`@tevm/ts-plugin: unable to read file ${fileName}`)
			}
			return file
		},
		existsSync: (fileName) => lsHost.fileExists(fileName),
		readFileSync: (fileName, encoding) => {
			const file = lsHost.readFile(fileName, encoding)
			if (!file) {
				throw new Error(`@tevm/ts-plugin: unable to read file ${fileName}`)
			}
			return file
		},
	}
}
