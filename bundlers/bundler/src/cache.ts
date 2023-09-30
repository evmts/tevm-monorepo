import type { SolcInputDescription, SolcOutput } from './solc/solc'
import type { Cache } from './types'

export const readCache = <TIncludeAsts extends boolean>(
	cache: Cache<TIncludeAsts>,
	entryModuleId: string,
	sources: SolcInputDescription['sources'],
): SolcOutput | undefined => {
	const previousCachedItem = cache[entryModuleId]
	if (!previousCachedItem) {
		return undefined
	}
	const { sources: previousSources } = previousCachedItem.solcInput
	if (Object.keys(sources).length !== Object.keys(previousSources).length) {
		return undefined
	}
	for (const [key, newSource] of Object.entries(sources)) {
		const oldSource = previousSources[key]
		if (!oldSource) {
			return undefined
		}
		if (!('content' in oldSource) || !('content' in newSource)) {
			console.error(
				'Unexpected error: Unable to use cache because content is undefined. Continuing without using cache',
			)
			return undefined
		}
		if (oldSource.content !== newSource.content) {
			return undefined
		}
	}
	return previousCachedItem.solcOutput
}
