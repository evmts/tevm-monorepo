import type { FileAccessObject, Logger } from './types.js'
import type { SolcInputDescription, SolcOutput } from '@tevm/solc'

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

export const createCache: CreateCache
