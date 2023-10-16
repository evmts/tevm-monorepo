import type { SolcInputDescription, SolcOutput } from './solc/solc.js'
import type { Logger } from './types.js'

export type CacheObject = {
	[filePath: string]: SolcOutput
}

export type Cache = {
	read: (entryModuleId: string) => SolcOutput
	write: (entryModuleId: string, compiledContracts: SolcOutput) => void
	isCached: (
		entryModuleId: string,
		sources: SolcInputDescription['sources'],
	) => boolean
}

export type CreateCache = (logger: Logger) => Cache

export const createCache: CreateCache
