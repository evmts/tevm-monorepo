import { FileAccessObject } from '@tevm/base-bundler'
import {
	existsSync,
	mkdirSync,
	readFileSync,
	statSync,
	writeFileSync,
} from 'fs'
import { access, mkdir, readFile, stat, writeFile } from 'fs/promises'
import typescript from 'typescript/lib/tsserverlibrary.js'

export const createFileAccessObject = (
	lsHost: typescript.LanguageServiceHost,
): FileAccessObject => {
	return {
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
		exists: async (fileName) => {
			return lsHost.fileExists(fileName)
		},
		readFile: async (fileName, encoding) => {
			const file = lsHost.readFile(fileName, encoding)
			if (!file) {
				throw new Error(`@tevm/ts-plugin: unable to read file ${fileName}`)
			}
			return file
		},
		stat,
		statSync,
		mkdirSync,
		mkdir,
		writeFile,
	}
}

export const createRealFileAccessObject = (): FileAccessObject => {
	return {
		readFile,
		existsSync,
		readFileSync,
		writeFileSync,
		statSync,
		stat,
		mkdirSync,
		mkdir,
		writeFile,
		exists: async (fileName) => {
			try {
				await access(fileName)
				return true
			} catch (e) {
				return false
			}
		},
	}
}
