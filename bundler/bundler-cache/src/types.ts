import type { SolcInputDescription, SolcOutput } from '@tevm/solc'

/**
 * Generalized interface for accessing file system
 * Allows this package to be used in browser environments or otherwise pluggable
 */
export type FileAccessObject = {
	writeFileSync: (path: string, data: string) => void
	readFile: (path: string, encoding: BufferEncoding) => Promise<string>
	readFileSync: (path: string, encoding: BufferEncoding) => string
	existsSync: (path: string) => boolean
}

export type Logger = {
	info: (...messages: string[]) => void
	error: (...message: string[]) => void
	warn: (...message: string[]) => void
	log: (...message: string[]) => void
}

export type CachedItem = 'artifactsJson' | 'dts' | 'mjs'

interface ReadFunction {
	(entryModuleId: string, cachedItem: 'artifactsJson'): SolcOutput
	(entryModuleId: string, cachedItem: 'dts'): string
	(entryModuleId: string, cachedItem: 'mjs'): string
}

interface WriteFunction {
	(
		entryModuleId: string,
		solcOutput: SolcOutput,
		cachedItem: 'artifactsJson',
	): void
	(entryModuleId: string, dtsFile: string, cachedItem: 'dts'): void
	(entryModuleId: string, mjsFile: string, cachedItem: 'mjs'): void
}

export type Cache = {
	read: ReadFunction
	write: WriteFunction
	isCached: (
		entryModuleId: string,
		sources: SolcInputDescription['sources'],
		cachedItem: CachedItem,
	) => boolean
}

export type CreateCache = (
	logger: Logger,
	cacheDir: string,
	fs: FileAccessObject,
	cwd: string,
) => Cache
