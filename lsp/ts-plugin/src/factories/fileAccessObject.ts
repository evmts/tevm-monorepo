import { FileAccessObject } from '@tevm/base'
import { mkdirSync, statSync } from 'fs'
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
		writeFileSync: (fileName, data) => {
			lsHost.writeFile?.(fileName, data)
		},
		// TODO clean this up. This works fine only because only the cache needs them and the cache is operating on a real file system and not a virtual one
		// What we should do is instead create a real file system Fao interface and a virtual one and then use the real one for the cache the virtual one for the typeserver
		statSync,
		mkdirSync: mkdirSync,
	}
}
