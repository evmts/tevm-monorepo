import type { SolcInputDescription, SolcOutput } from './solc/solc'
import type { Logger } from './types'

type CacheObject = {
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

export const createCache = (logger: Logger): Cache => {
	const cache: CacheObject = {}

	const write = (entryModuleId: string, compiledContracts: SolcOutput) => {
		cache[entryModuleId] = compiledContracts
	}

	const read = (entryModuleId: string): SolcOutput => {
		const out = cache[entryModuleId]
		if (!out) {
			throw new Error(
				`Cache miss for ${entryModuleId}. Try calling isCached first`,
			)
		}
		return out
	}

	const isCached = (
		entryModuleId: string,
		sources: SolcInputDescription['sources'],
	) => {
		const previousCachedItem = cache[entryModuleId]
		if (!previousCachedItem) {
			return false
		}
		const { sources: previousSources } = previousCachedItem
		if (Object.keys(sources).length !== Object.keys(previousSources).length) {
			return false
		}
		for (const [key, newSource] of Object.entries(sources)) {
			const oldSource = previousSources[key]
			if (!oldSource) {
				return false
			}
			if (!('content' in oldSource) || !('content' in newSource)) {
				logger.error(
					'Unexpected error: Unable to use cache because content is undefined. Continuing without cache.',
				)
				return false
			}
			if (oldSource.content !== newSource.content) {
				return false
			}
		}
		return true
	}

	return {
		read,
		write,
		isCached,
	}
}
