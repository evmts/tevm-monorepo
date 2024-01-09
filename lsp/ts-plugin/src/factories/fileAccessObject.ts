import { FileAccessObject } from '@tevm/base'
import {
	existsSync,
	mkdirSync,
	readFileSync,
	statSync,
	writeFileSync,
} from 'fs'
import { readFile } from 'fs/promises'
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
		// These are just stubs to match interface since making multiple interfaces is tedious atm
		statSync,
		mkdirSync,
	}
}

export const createRealFileAccessObject = (): FileAccessObject => {
	return {
		readFile,
		existsSync,
		readFileSync,
		writeFileSync,
		statSync,
		mkdirSync,
	}
}
