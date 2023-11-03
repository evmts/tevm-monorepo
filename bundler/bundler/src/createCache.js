import { fail, logError, map, succeed } from 'effect/Effect'

export class CacheMissError extends Error {
	/**
	 * @type {'CacheMissError'}
	 */
	_tag = 'CacheMissError'
	/**
	 * @type {'CacheMissError'}
	 * @override
	 */
	name = 'CacheMissError'

	/**
	 * @param {string} id
	 */
	constructor(id) {
		super(`Cache miss for ${id}. Try calling isCached first`)
	}
}

/**
 * @typedef {import('./createCache.js').Cache} Cache

/**
 * Creates the EVMts cache for @evmts/bundler
 * @type {import('./createCache.js').CreateCache}
 */
export const createCache = (initialCache = {}) => {
	const internalCache = initialCache
	/**
	 * @type {import("./createCache.d.ts").Cache}
	 */
	const cache = {
		write: (entryModuleId, compiledContracts) => {
			internalCache[entryModuleId] = compiledContracts
			return succeed(cache)
		},
		read: (entryModuleId) => {
			const out = internalCache[entryModuleId]
			if (!out) {
				fail(new Error(entryModuleId))
			}
			return succeed(out)
		},
		isCached: (entryModuleId, sources) => {
			const previousCachedItem = internalCache[entryModuleId]
			if (!previousCachedItem) {
				return succeed(false)
			}
			const { sources: previousSources } = previousCachedItem
			if (Object.keys(sources).length !== Object.keys(previousSources).length) {
				return succeed(false)
			}
			for (const [key, newSource] of Object.entries(sources)) {
				const oldSource = previousSources[key]
				if (!oldSource) {
					return succeed(false)
				}
				if (!('content' in oldSource) || !('content' in newSource)) {
					return logError('Unexpected error: Unable to use cache because content is undefined. Continuing without cache.').pipe(map(() => false))
				}
				if (oldSource.content !== newSource.content) {
					return succeed(false)
				}
			}
			return succeed(true)
		},
	}
	return succeed(cache)
}
