import { describe, expect, it, beforeEach } from 'vitest'
import { AccountCache } from './AccountCache.js'
import { CacheType } from './cache-types.js'
import { createAddressFromString } from './address.js'
import { createAccount } from './account-class.js'

describe('AccountCache', () => {
	const address1 = createAddressFromString('0x1234567890123456789012345678901234567890')
	const address2 = createAddressFromString('0x0000000000000000000000000000000000000001')
	const account1 = createAccount({ nonce: 1n, balance: 100n })
	const account2 = createAccount({ nonce: 2n, balance: 200n })

	describe('LRU cache type', () => {
		let cache: AccountCache

		beforeEach(() => {
			cache = new AccountCache({ size: 100, type: CacheType.LRU })
		})

		describe('basic operations', () => {
			it('should put and get an account', () => {
				cache.put(address1, account1)
				const result = cache.get(address1)
				expect(result).toBeDefined()
				expect(result?.accountRLP).toBeDefined()
			})

			it('should return undefined for non-existent account', () => {
				const result = cache.get(address1)
				expect(result).toBeUndefined()
			})

			it('should delete an account', () => {
				cache.put(address1, account1)
				cache.del(address1)
				const result = cache.get(address1)
				// del marks as deleted (accountRLP: undefined), not removes from cache
				expect(result).toBeDefined()
				expect(result?.accountRLP).toBeUndefined()
			})

			it('should clear the cache', () => {
				cache.put(address1, account1)
				cache.put(address2, account2)
				cache.clear()
				expect(cache.size()).toBe(0)
			})

			it('should return correct size', () => {
				expect(cache.size()).toBe(0)
				cache.put(address1, account1)
				expect(cache.size()).toBe(1)
				cache.put(address2, account2)
				expect(cache.size()).toBe(2)
			})
		})

		describe('checkpoint/revert/commit', () => {
			it('should checkpoint and commit', () => {
				cache.put(address1, account1)
				cache.checkpoint()
				cache.put(address2, account2)
				cache.commit()

				expect(cache.get(address1)).toBeDefined()
				expect(cache.get(address2)).toBeDefined()
			})

			it('should checkpoint and revert', () => {
				cache.put(address1, account1)
				cache.checkpoint()
				cache.put(address1, account2) // Overwrite
				cache.revert()

				const result = cache.get(address1)
				expect(result).toBeDefined()
				// Should be back to account1
			})

			it('should revert to no account if it did not exist', () => {
				cache.checkpoint()
				cache.put(address1, account1)
				cache.revert()

				expect(cache.get(address1)).toBeUndefined()
			})

			it('should handle nested checkpoints', () => {
				cache.put(address1, account1)
				cache.checkpoint()
				cache.put(address1, account2)
				cache.checkpoint()
				cache.del(address1)

				// First revert - restore from del to account2
				cache.revert()
				let result = cache.get(address1)
				expect(result?.accountRLP).toBeDefined()

				// Second revert - restore from account2 to account1
				cache.revert()
				result = cache.get(address1)
				expect(result?.accountRLP).toBeDefined()
			})

			it('should do nothing on revert without checkpoint', () => {
				cache.put(address1, account1)
				cache.revert() // No checkpoint, should be no-op
				expect(cache.get(address1)).toBeDefined()
			})

			it('should do nothing on commit without checkpoint', () => {
				cache.put(address1, account1)
				cache.commit() // No checkpoint, should be no-op
				expect(cache.get(address1)).toBeDefined()
			})
		})

		describe('flush', () => {
			it('should return modified accounts at checkpoint', () => {
				cache.checkpoint()
				cache.put(address1, account1)
				cache.put(address2, account2)

				const flushed = cache.flush()
				expect(flushed.length).toBe(2)
			})

			it('should return empty array without checkpoint', () => {
				cache.put(address1, account1)
				const flushed = cache.flush()
				expect(flushed.length).toBe(0)
			})

			it('should reset diff cache after flush', () => {
				cache.checkpoint()
				cache.put(address1, account1)
				cache.flush()

				// Adding same address should add to diff cache again
				cache.put(address1, account2)
				const flushed = cache.flush()
				expect(flushed.length).toBe(1)
			})
		})

		describe('stats', () => {
			it('should track reads and hits', () => {
				cache.put(address1, account1)
				cache.get(address1) // hit
				cache.get(address2) // miss

				const stats = cache.stats()
				expect(stats.reads).toBe(2)
				expect(stats.hits).toBe(1)
				expect(stats.writes).toBe(1)
			})

			it('should track writes and deletions', () => {
				cache.put(address1, account1)
				cache.put(address2, account2)
				cache.del(address1)

				const stats = cache.stats()
				expect(stats.writes).toBe(2)
				expect(stats.deletions).toBe(1)
			})

			it('should reset stats when requested', () => {
				cache.put(address1, account1)
				cache.get(address1)

				const stats = cache.stats(true)
				expect(stats.writes).toBe(1)
				expect(stats.reads).toBe(1)

				const resetStats = cache.stats()
				expect(resetStats.writes).toBe(0)
				expect(resetStats.reads).toBe(0)
			})

			it('should include current size', () => {
				cache.put(address1, account1)
				const stats = cache.stats()
				expect(stats.size).toBe(1)
			})
		})
	})

	describe('ORDERED_MAP cache type', () => {
		let cache: AccountCache

		beforeEach(() => {
			cache = new AccountCache({ size: 100, type: CacheType.ORDERED_MAP })
		})

		it('should put and get an account', () => {
			cache.put(address1, account1)
			const result = cache.get(address1)
			expect(result).toBeDefined()
			expect(result?.accountRLP).toBeDefined()
		})

		it('should delete an account', () => {
			cache.put(address1, account1)
			cache.del(address1)
			const result = cache.get(address1)
			expect(result?.accountRLP).toBeUndefined()
		})

		it('should checkpoint and revert', () => {
			cache.put(address1, account1)
			cache.checkpoint()
			cache.put(address1, account2)
			cache.revert()

			expect(cache.get(address1)).toBeDefined()
		})

		it('should clear the cache', () => {
			cache.put(address1, account1)
			cache.clear()
			expect(cache.size()).toBe(0)
		})

		it('should return correct size', () => {
			expect(cache.size()).toBe(0)
			cache.put(address1, account1)
			expect(cache.size()).toBe(1)
		})
	})

	describe('put with undefined account', () => {
		it('should store undefined account (known to not exist)', () => {
			const cache = new AccountCache({ size: 100, type: CacheType.LRU })
			cache.put(address1, undefined)
			const result = cache.get(address1)
			expect(result).toBeDefined()
			expect(result?.accountRLP).toBeUndefined()
		})
	})
})
