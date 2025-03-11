import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import type { FileAccessObject } from '@tevm/base-bundler'
import type typescript from 'typescript/lib/tsserverlibrary.js'

/**
 * Creates a FileAccessObject implementation that uses the TypeScript LanguageServiceHost
 * to read and write files.
 *
 * This adapter allows the Tevm bundler to interact with the TypeScript language service's
 * virtual file system rather than directly with the real file system. The LSP maintains
 * its own view of files, which may include unsaved changes not yet written to disk.
 *
 * @param lsHost - The TypeScript language service host providing file access
 * @returns A FileAccessObject implementation that delegates to the LanguageServiceHost
 */
export const createFileAccessObject = (lsHost: typescript.LanguageServiceHost): FileAccessObject => {
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

/**
 * Creates a FileAccessObject implementation that uses the real filesystem.
 *
 * This implementation directly uses Node.js fs/fs.promises APIs to access the
 * actual filesystem rather than the TypeScript language service's virtual filesystem.
 * It's primarily used for operations that need to persist outside the language
 * service context, such as caching.
 *
 * @returns A FileAccessObject implementation using real filesystem access
 */
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
