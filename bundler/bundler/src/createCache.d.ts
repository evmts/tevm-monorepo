import type { Effect } from 'effect/Effect'
import type { SolcInputDescription, SolcOutput } from './solc/solc.js'
import type { Logger } from './types.js'
import { CacheMissError } from './createCache.js'

export { CacheMissError }

export type CacheObject = {
	[filePath: string]: SolcOutput
}

export type Cache = {
	read: (entryModuleId: string) => Effect<never, never, SolcOutput>
	write: (entryModuleId: string, compiledContracts: SolcOutput) => Effect<never, CacheMissError, Cache>
	isCached: (
		entryModuleId: string,
		sources: SolcInputDescription['sources'],
	) => Effect<never, never, boolean>
}

export type CreateCache = (initialCache?: CacheObject) => Effect<never, never, Cache>

export const createCache: CreateCache
