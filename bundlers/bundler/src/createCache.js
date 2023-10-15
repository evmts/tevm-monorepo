/**
 * @typedef {import('./createCache.js').Cache} Cache

/**
 * @type {import('./createCache.js').CreateCache}
 */
export const createCache = (logger) => {
	/**
	 * @type {import('./createCache.js').CacheObject}
	 */
	const cache = {}

	return {
		write: (entryModuleId, compiledContracts) => {
			cache[entryModuleId] = compiledContracts
		},
		read: (entryModuleId) => {
			const out = cache[entryModuleId]
			if (!out) {
				throw new Error(
					`Cache miss for ${entryModuleId}. Try calling isCached first`,
				)
			}
			return out
		},
		isCached: (entryModuleId, sources) => {
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
		},
	}
}
