import type { SolcInputDescription, SolcOutput } from './solc/solc.js'
import type { FileAccessObject, Logger } from './types.js'

export type Cache = {
	read: (entryModuleId: string) => SolcOutput
	write: (entryModuleId: string, compiledContracts: SolcOutput) => void
	isCached: (
		entryModuleId: string,
		sources: SolcInputDescription['sources'],
	) => boolean
}

export type CreateCache = (logger: Logger, cacheDir: string, fs: FileAccessObject, cwd: string) => Cache

export const createCache: CreateCache
