import { describe, expect, it, beforeEach } from 'vitest'
import { StorageCache } from './StorageCache.js'
import { CacheType } from './cache-types.js'
import { createAddressFromString } from './address.js'

describe('StorageCache', () => {
	const address1 = createAddressFromString('0x1234567890123456789012345678901234567890')
	const address2 = createAddressFromString('0x0000000000000000000000000000000000000001')
	const key1 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
	const key2 = new Uint8Array([32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1])
	const value1 = new Uint8Array([100, 200])
	const value2 = new Uint8Array([50, 100, 150])

	describe('LRU cache type', () => {
		let cache: StorageCache

		beforeEach(() => {
			cache = new StorageCache({ size: 100, type: CacheType.LRU })
		})

		describe('basic operations', () => {
			it('should put and get a storage value', () => {
				cache.put(address1, key1, value1)
				const result = cache.get(address1, key1)
				expect(result).toEqual(value1)
			})

			it('should return undefined for non-existent value', () => {
				const result = cache.get(address1, key1)
				expect(result).toBeUndefined()
			})

			it('should delete a storage value', () => {
				cache.put(address1, key1, value1)
				cache.del(address1, key1)
				const result = cache.get(address1, key1)
				expect(result).toBeUndefined()
			})

			it('should clear all storage for an address', () => {
				cache.put(address1, key1, value1)
				cache.put(address1, key2, value2)
				cache.clearStorage(address1)
				expect(cache.get(address1, key1)).toBeUndefined()
				expect(cache.get(address1, key2)).toBeUndefined()
			})

			it('should clear the entire cache', () => {
				cache.put(address1, key1, value1)
				cache.put(address2, key1, value2)
				cache.clear()
				expect(cache.size()).toBe(0)
			})

			it('should return correct size', () => {
				expect(cache.size()).toBe(0)
				cache.put(address1, key1, value1)
				expect(cache.size()).toBe(1)
				cache.put(address1, key2, value2)
				expect(cache.size()).toBe(2)
				cache.put(address2, key1, value1)
				expect(cache.size()).toBe(3)
			})
		})

		describe('checkpoint/revert/commit', () => {
			it('should checkpoint and commit', () => {
				cache.put(address1, key1, value1)
				cache.checkpoint()
				cache.put(address1, key2, value2)
				cache.commit()

				expect(cache.get(address1, key1)).toEqual(value1)
				expect(cache.get(address1, key2)).toEqual(value2)
			})

			it('should checkpoint and revert', () => {
				cache.put(address1, key1, value1)
				cache.checkpoint()
				cache.put(address1, key1, value2) // Overwrite
				cache.revert()

				const result = cache.get(address1, key1)
				expect(result).toEqual(value1)
			})

			it('should revert to no value if it did not exist', () => {
				cache.checkpoint()
				cache.put(address1, key1, value1)
				cache.revert()

				expect(cache.get(address1, key1)).toBeUndefined()
			})

			it('should handle nested checkpoints', () => {
				cache.put(address1, key1, value1)
				cache.checkpoint()
				cache.put(address1, key1, value2)
				cache.checkpoint()
				cache.del(address1, key1)

				// First revert - restore from del to value2
				cache.revert()
				expect(cache.get(address1, key1)).toEqual(value2)

				// Second revert - restore from value2 to value1
				cache.revert()
				expect(cache.get(address1, key1)).toEqual(value1)
			})

			it('should do nothing on revert without checkpoint', () => {
				cache.put(address1, key1, value1)
				cache.revert() // No checkpoint, should be no-op
				expect(cache.get(address1, key1)).toEqual(value1)
			})

			it('should do nothing on commit without checkpoint', () => {
				cache.put(address1, key1, value1)
				cache.commit() // No checkpoint, should be no-op
				expect(cache.get(address1, key1)).toEqual(value1)
			})
		})

		describe('flush', () => {
			it('should return modified values at checkpoint', () => {
				cache.checkpoint()
				cache.put(address1, key1, value1)
				cache.put(address1, key2, value2)

				const flushed = cache.flush()
				expect(flushed.length).toBe(2)
			})

			it('should return empty array without checkpoint', () => {
				cache.put(address1, key1, value1)
				const flushed = cache.flush()
				expect(flushed.length).toBe(0)
			})

			it('should reset diff cache after flush', () => {
				cache.checkpoint()
				cache.put(address1, key1, value1)
				cache.flush()

				// Adding same key should add to diff cache again
				cache.put(address1, key1, value2)
				const flushed = cache.flush()
				expect(flushed.length).toBe(1)
			})
		})

		describe('stats', () => {
			it('should track reads and hits', () => {
				cache.put(address1, key1, value1)
				cache.get(address1, key1) // hit
				cache.get(address1, key2) // miss

				const stats = cache.stats()
				expect(stats.reads).toBe(2)
				expect(stats.hits).toBe(1)
				expect(stats.writes).toBe(1)
			})

			it('should track writes and deletions', () => {
				cache.put(address1, key1, value1)
				cache.put(address1, key2, value2)
				cache.del(address1, key1)

				const stats = cache.stats()
				expect(stats.writes).toBe(2)
				expect(stats.deletions).toBe(1)
			})

			it('should reset stats when requested', () => {
				cache.put(address1, key1, value1)
				cache.get(address1, key1)

				const stats = cache.stats(true)
				expect(stats.writes).toBe(1)
				expect(stats.reads).toBe(1)

				const resetStats = cache.stats()
				expect(resetStats.writes).toBe(0)
				expect(resetStats.reads).toBe(0)
			})

			it('should include current size', () => {
				cache.put(address1, key1, value1)
				const stats = cache.stats()
				expect(stats.size).toBe(1)
			})
		})

		describe('dump', () => {
			it('should dump storage for an address', () => {
				cache.put(address1, key1, value1)
				cache.put(address1, key2, value2)

				const dumped = cache.dump(address1)
				expect(dumped).toBeDefined()
				expect(dumped?.size).toBe(2)
			})

			it('should return undefined for non-existent address', () => {
				const dumped = cache.dump(address1)
				expect(dumped).toBeUndefined()
			})
		})
	})

	describe('ORDERED_MAP cache type', () => {
		let cache: StorageCache

		beforeEach(() => {
			cache = new StorageCache({ size: 100, type: CacheType.ORDERED_MAP })
		})

		it('should put and get a storage value', () => {
			cache.put(address1, key1, value1)
			const result = cache.get(address1, key1)
			expect(result).toEqual(value1)
		})

		it('should delete a storage value', () => {
			cache.put(address1, key1, value1)
			cache.del(address1, key1)
			const result = cache.get(address1, key1)
			expect(result).toBeUndefined()
		})

		it('should checkpoint and revert', () => {
			cache.put(address1, key1, value1)
			cache.checkpoint()
			cache.put(address1, key1, value2)
			cache.revert()

			expect(cache.get(address1, key1)).toEqual(value1)
		})

		it('should clear the cache', () => {
			cache.put(address1, key1, value1)
			cache.clear()
			expect(cache.size()).toBe(0)
		})

		it('should return correct size', () => {
			expect(cache.size()).toBe(0)
			cache.put(address1, key1, value1)
			expect(cache.size()).toBe(1)
		})

		it('should clear storage for an address', () => {
			cache.put(address1, key1, value1)
			cache.clearStorage(address1)
			expect(cache.get(address1, key1)).toBeUndefined()
		})

		it('should dump storage for an address', () => {
			cache.put(address1, key1, value1)
			const dumped = cache.dump(address1)
			expect(dumped).toBeDefined()
		})
	})
})
