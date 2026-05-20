import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import type { FileAccessObject } from '@tevm/base-bundler'
import path from 'node:path'
import type typescript from 'typescript/lib/tsserverlibrary.js'

const hashText = (text: string): number => {
	let hash = 0
	for (let i = 0; i < text.length; i++) {
		hash = (hash * 31 + text.charCodeAt(i)) >>> 0
	}
	return hash
}

const getScriptSnapshotText = (lsHost: typescript.LanguageServiceHost, fileName: string, cwd: string): string | undefined => {
	const candidates = [fileName, path.resolve(cwd, fileName)]
	for (const candidate of candidates) {
		try {
			const snapshot = lsHost.getScriptSnapshot?.(candidate)
			if (snapshot) {
				return snapshot.getText(0, snapshot.getLength())
			}
		} catch (_e) {
			// Fall through to the next candidate.
		}
	}
	return undefined
}

const getScriptVersion = (lsHost: typescript.LanguageServiceHost, fileName: string, cwd: string): string | undefined => {
	const candidates = [fileName, path.resolve(cwd, fileName)]
	for (const candidate of candidates) {
		try {
			const version = lsHost.getScriptVersion?.(candidate)
			if (version !== undefined) {
				return version
			}
		} catch (_e) {
			// Fall through to the next candidate.
		}
	}
	return undefined
}

const getVirtualMtimeMs = (lsHost: typescript.LanguageServiceHost, fileName: string, cwd: string): number | undefined => {
	const snapshotText = getScriptSnapshotText(lsHost, fileName, cwd)
	const version = getScriptVersion(lsHost, fileName, cwd)
	if (snapshotText === undefined) {
		return undefined
	}
	return hashText(`${version ?? ''}:${snapshotText}`)
}

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
			if (!lsHost.writeFile) {
				throw new Error(`@tevm/ts-plugin: host cannot write file ${fileName}`)
			}
			lsHost.writeFile(fileName, data)
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
export const createRealFileAccessObject = (
	lsHost?: typescript.LanguageServiceHost,
	cwd = process.cwd(),
): FileAccessObject => {
	if (!lsHost) {
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
				} catch (_e) {
					return false
				}
			},
		}
	}
	return {
		readFile,
		existsSync,
		readFileSync,
		writeFileSync,
		statSync: (fileName) => {
			const virtualMtimeMs = getVirtualMtimeMs(lsHost, fileName, cwd)
			if (virtualMtimeMs === undefined) {
				return statSync(fileName)
			}
			try {
				return { ...statSync(fileName), mtimeMs: virtualMtimeMs } as ReturnType<typeof statSync>
			} catch (_e) {
				return { mtimeMs: virtualMtimeMs } as ReturnType<typeof statSync>
			}
		},
		stat: async (fileName) => {
			const virtualMtimeMs = getVirtualMtimeMs(lsHost, fileName, cwd)
			if (virtualMtimeMs === undefined) {
				return stat(fileName)
			}
			try {
				return { ...(await stat(fileName)), mtimeMs: virtualMtimeMs } as Awaited<ReturnType<typeof stat>>
			} catch (_e) {
				return { mtimeMs: virtualMtimeMs } as Awaited<ReturnType<typeof stat>>
			}
		},
		mkdirSync,
		mkdir,
		writeFile,
		exists: async (fileName) => {
			try {
				await access(fileName)
				return true
			} catch (_e) {
				return false
			}
		},
	}
}
