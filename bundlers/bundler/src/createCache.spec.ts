import { type Cache, createCache } from './createCache.js'
import type { Logger } from './types.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe(createCache.name, () => {
	let mockLogger: Logger = {
		log: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
	}
	let cache: Cache = createCache(mockLogger)

	beforeEach(() => {
		mockLogger = {
			log: vi.fn(),
			warn: vi.fn(),
			error: vi.fn(),
			info: vi.fn(),
		}
		cache = createCache(mockLogger)
	})

	describe(cache.read.name, () => {
		it('should throw error on cache miss', () => {
			expect(() => cache.read('someModuleId')).toThrow(Error)
		})

		it('should return cached value', () => {
			const expectedOutput = {
				sources: { 'some/path': { content: 'content' } },
			}
			cache.write('someModuleId', expectedOutput as any)
			const result = cache.read('someModuleId')
			expect(result).toEqual(expectedOutput)
		})
	})

	describe(cache.write.name, () => {
		it('should write value to cache', () => {
			const output = {
				sources: { 'some/path': { content: 'content' } },
			}
			cache.write('someModuleId', output as any)
			const result = cache.isCached('someModuleId', {
				'some/path': { content: 'content' },
			})
			expect(result).toBe(true)
		})
	})

	describe(cache.isCached.name, () => {
		it('should return false if there is no previous cached item', () => {
			const result = cache.isCached('someModuleId', {
				'some/path': { content: 'content' },
			})
			expect(result).toBe(false)
		})

		it('should return false if the number of sources differ', () => {
			cache.write('someModuleId', {
				sources: {
					'some/path': { content: 'content' },
				},
			} as any)
			const result = cache.isCached('someModuleId', {
				'some/path': { content: 'content' },
				'another/path': { content: 'another content' },
			})
			expect(result).toBe(false)
		})

		it('should return false if a source is missing in cached data', () => {
			cache.write('someModuleId', {
				sources: {
					'some/path': { content: 'content' },
				},
			} as any)
			const result = cache.isCached('someModuleId', {
				'some/path': { content: 'content' },
				'new/path': { content: 'new content' },
			})
			expect(result).toBe(false)
		})

		it('should return false and log an error if content is missing in cached or new source', () => {
			cache.write('someModuleId', {
				sources: {
					'some/path': {},
				},
			} as any)
			const result = cache.isCached('someModuleId', {
				'some/path': { content: 'content' },
			})
			expect(result).toBe(false)
			expect(mockLogger.error).toHaveBeenCalledWith(
				'Unexpected error: Unable to use cache because content is undefined. Continuing without cache.',
			)
		})

		it('should return false if old sources had different file', () => {
			cache.write('someModuleId', {
				sources: {
					'some/path': { content: 'content' },
				},
			} as any)
			const result = cache.isCached('someModuleId', {
				'different/path': { content: 'content' },
			})
			expect(result).toBe(false)
		})

		it('should return false if content in sources differs', () => {
			cache.write('someModuleId', {
				sources: {
					'some/path': { content: 'old content' },
				},
			} as any)
			const result = cache.isCached('someModuleId', {
				'some/path': { content: 'new content' },
			})
			expect(result).toBe(false)
		})

		it('should return true if sources match with the cache', () => {
			cache.write('someModuleId', {
				sources: {
					'some/path': { content: 'content' },
				},
			} as any)
			const result = cache.isCached('someModuleId', {
				'some/path': { content: 'content' },
			})
			expect(result).toBe(true)
		})
	})
})
