import { describe, expect, it } from 'vitest'
import { CacheType } from './cache-types.js'

describe('CacheType', () => {
	it('should export LRU cache type', () => {
		expect(CacheType.LRU).toBe('lru')
	})

	it('should export ORDERED_MAP cache type', () => {
		expect(CacheType.ORDERED_MAP).toBe('ordered_map')
	})

	it('should be a const object with only two properties', () => {
		const keys = Object.keys(CacheType)
		expect(keys).toHaveLength(2)
		expect(keys).toContain('LRU')
		expect(keys).toContain('ORDERED_MAP')
	})

	it('should have string values for both cache types', () => {
		expect(typeof CacheType.LRU).toBe('string')
		expect(typeof CacheType.ORDERED_MAP).toBe('string')
	})
})
