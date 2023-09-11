import { FileAccessObject } from '@evmts/bundler'
import typescript from 'typescript/lib/tsserverlibrary'

export const createFileAccessObject = (
	lsHost: typescript.LanguageServiceHost,
): FileAccessObject => {
	return {
		readFile: async (fileName, encoding) => {
			const file = lsHost.readFile(fileName, encoding)
			if (!file) {
				throw new Error(`@evmts/ts-plugin: unable to read file ${fileName}`)
			}
			return file
		},
		existsSync: (fileName) => lsHost.fileExists(fileName),
		readFileSync: (fileName, encoding) => {
			const file = lsHost.readFile(fileName, encoding)
			if (!file) {
				throw new Error(`@evmts/ts-plugin: unable to read file ${fileName}`)
			}
			return file
		},
	}
}
