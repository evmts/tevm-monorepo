import { flatMap, type Effect, flip, runSync } from 'effect/Effect'
import { type Cache, createCache } from './createCache.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { CacheMissError } from './createCache.js'

describe(createCache.name, () => {
	let cache: Effect<never, never, Cache> = createCache()

	beforeEach(() => {
		cache = createCache()
	})

	it('should allow you to prepopulate the cache', () => {
		const content = {
			sources: {
				'some/path': { content: 'content' },
			},
		}
		const cacheObject = {
			someModuleId: content as any,
		}
		const result = createCache(cacheObject).pipe(
			flatMap(({ read }) => read('someModuleId'))
		)
		expect(runSync(result)).toEqual(content)
	})

	describe('cache.read', () => {
		it('should return cached value', () => {
			const expectedOutput = {
				sources: { 'some/path': { content: 'content' } },
			}
			const readResult = cache.pipe(
				flatMap(({ write }) => write('someModuleId', expectedOutput as any)),
				flatMap(({ read }) => read('someModuleId'))
			)
			expect(runSync(readResult)).toEqual(expectedOutput)
		})

		it('should throw error on cache miss', () => {
			const errEffect = cache.pipe(
				flatMap(cache => cache.read('someModuleId')),
				flip
			)
			expect(runSync(errEffect)).toBe(new CacheMissError('someModuleId'))
		})
	})

	describe('write', () => {
		it('should write value to cache', () => {
			const output = {
				sources: { 'some/path': { content: 'content' } },
			}
			const result = cache.pipe(
				flatMap(({ write }) => write('someModuleId', output as any)),
				flatMap(({ isCached }) => isCached('someModuleId', output))
			)
			expect(runSync(result)).toBe(true)
		})
	})

	describe('isCached', () => {
		it('should return false if there is no previous cached item', () => {
			const result = cache.pipe(
				flatMap(({ isCached }) => isCached('someModuleId', {})),
			)
			expect(runSync(result)).toBe(false)
		})

		it('should return false if the number of sources differ', () => {
			const result = cache.pipe(
				flatMap(({ write }) => write('someModuleId', {
					sources: {
						'some/path': { content: 'content' },
					},
				} as any)),
				flatMap(({ isCached }) => isCached('someModuleId', {
					'some/path': { content: 'content' },
					'another/path': { content: 'another content' },
				}))
			)
			expect(runSync(result)).toBe(false)
		})

		it('should return false if a source is missing in cached data', () => {
			const result = cache.pipe(
				flatMap(({ write }) => write('someModuleId', {
					sources: {
						'some/path': { content: 'content' },
					},
				} as any)),
				flatMap(({ isCached }) => isCached('someModuleId', {
					'some/path': { content: 'content' },
					'new/path': { content: 'new content' },
				}))
			)
			expect(runSync(result)).toBe(false)
		})

		it('should return false and log an error if content is missing in cached or new source', () => {
			const result = cache.pipe(
				flatMap(({ write }) => write('someModuleId', {
					sources: {
						'some/path': {},
					},
				} as any)
				),
				flatMap(({ isCached }) => isCached('someModuleId', {
					'some/path': { content: 'content' },
				}))
			)
			expect(runSync(result)).toBe(false)
		})

		it('should return false if old sources had different file', () => {
			const result = cache.pipe(
				flatMap(({ write }) => write('someModuleId', {
					sources: {
						'some/path': { content: 'content' },
					},
				} as any)),
				flatMap(({ isCached }) => isCached('someModuleId', {
					'different/path': { content: 'content' },
				}))
			)
			expect(runSync(result)).toBe(false)
		})

		it('should return false if content in sources differs', () => {
			const result = cache.pipe(
				flatMap(({ write }) => write('someModuleId', {
					sources: {
						'some/path': { content: 'old content' },
					},
				} as any)),
				flatMap(({ isCached }) => isCached('someModuleId', {
					'some/path': { content: 'new content' },
				}))
			)
			expect(runSync(result)).toBe(false)
		})

		it('should return true if sources match with the cache', () => {
			const result = cache.pipe(
				flatMap(({ write }) => write('someModuleId', {
					sources: {
						'some/path': { content: 'content' },
					},
				} as any)),
				flatMap(({ isCached }) => isCached('someModuleId', {
					'some/path': { content: 'content' },
				}))
			)

			expect(runSync(result)).toBe(true)
		})
	})
})
