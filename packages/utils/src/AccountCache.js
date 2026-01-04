import { LRUCache } from 'lru-cache'
import { CacheType } from './cache-types.js'
import { bytesToUnprefixedHex } from './bytesToUnprefixedHex.js'

/**
 * Account cache element type
 * accountRLP: undefined means account is known not to exist in the trie
 * @typedef {{accountRLP: Uint8Array | undefined}} AccountCacheElement
 */

/**
 * Native AccountCache implementation for tevm, replacing @ethereumjs/statemanager AccountCache.
 *
 * Implements checkpoint/revert/commit functionality for account caching.
 * Supports both LRU and ordered map cache types.
 *
 * @example
 * ```javascript
 * import { AccountCache, CacheType } from '@tevm/utils'
 *
 * const cache = new AccountCache({ size: 100000, type: CacheType.LRU })
 *
 * // Store an account
 * cache.put(address, account)
 *
 * // Retrieve an account
 * const elem = cache.get(address)
 *
 * // Checkpoint/revert support
 * cache.checkpoint()
 * cache.put(address, newAccount)
 * cache.revert() // restores previous account
 * ```
 */
export class AccountCache {
	/**
	 * Number of active checkpoints
	 * @type {number}
	 */
	_checkpoints = 0

	/**
	 * LRU cache instance (used when type is LRU)
	 * @type {LRUCache<string, AccountCacheElement> | undefined}
	 */
	_lruCache

	/**
	 * Ordered map cache instance (used when type is ORDERED_MAP)
	 * @type {Map<string, AccountCacheElement> | undefined}
	 */
	_orderedMapCache

	/**
	 * Diff cache for checkpoint/revert support
	 * Each array element represents a checkpoint level
	 * Stores the state of accounts before modification
	 * If the element is undefined, the account didn't exist before
	 * @type {Map<string, AccountCacheElement | undefined>[]}
	 */
	_diffCache = []

	/**
	 * Cache statistics
	 * @type {{size: number, reads: number, hits: number, writes: number, deletions: number}}
	 */
	_stats = {
		size: 0,
		reads: 0,
		hits: 0,
		writes: 0,
		deletions: 0,
	}

	/**
	 * Creates a new AccountCache instance
	 * @param {import('./cache-types.js').CacheOpts} opts - Cache options
	 */
	constructor(opts) {
		if (opts.type === CacheType.LRU) {
			this._lruCache = new LRUCache({ max: opts.size })
		} else {
			this._orderedMapCache = new Map()
		}
	}

	/**
	 * Saves the pre-state of a cache key before modification (for checkpoint support)
	 * @param {string} cacheKeyHex - Hex address string
	 */
	_saveCachePreState(cacheKeyHex) {
		if (this._checkpoints === 0) return

		const diffMap = this._diffCache[this._checkpoints - 1]
		if (!diffMap) return

		// Only save if not already saved at this checkpoint level
		if (!diffMap.has(cacheKeyHex)) {
			// Get current value (may be undefined if not in cache)
			const currentElem = this._getByHex(cacheKeyHex)
			diffMap.set(cacheKeyHex, currentElem)
		}
	}

	/**
	 * Get element by hex key (internal helper)
	 * @param {string} addressHex
	 * @returns {AccountCacheElement | undefined}
	 */
	_getByHex(addressHex) {
		if (this._lruCache) {
			return this._lruCache.get(addressHex)
		} else if (this._orderedMapCache) {
			return this._orderedMapCache.get(addressHex)
		}
		return undefined
	}

	/**
	 * Puts account to cache under its address.
	 * @param {import('./address.js').Address} address - Address of account
	 * @param {import('./account-class.js').Account | undefined} account - Account or undefined if account doesn't exist
	 * @param {boolean} [_couldBePartialAccount] - Whether this could be a partial account (for fork mode). Currently unused but kept for API compatibility.
	 * @returns {void}
	 */
	put(address, account, _couldBePartialAccount = false) {
		const addressHex = bytesToUnprefixedHex(address.bytes)

		this._saveCachePreState(addressHex)
		this._stats.writes++

		/** @type {AccountCacheElement} */
		const elem = {
			accountRLP: account ? account.serialize() : undefined,
		}

		if (this._lruCache) {
			this._lruCache.set(addressHex, elem)
		} else if (this._orderedMapCache) {
			this._orderedMapCache.set(addressHex, elem)
		}
	}

	/**
	 * Returns the queried account or undefined if account doesn't exist
	 * @param {import('./address.js').Address} address - Address of account
	 * @returns {AccountCacheElement | undefined}
	 */
	get(address) {
		const addressHex = bytesToUnprefixedHex(address.bytes)

		this._stats.reads++

		const elem = this._getByHex(addressHex)
		if (elem !== undefined) {
			this._stats.hits++
		}
		return elem
	}

	/**
	 * Marks address as deleted in cache.
	 * @param {import('./address.js').Address} address - Address
	 * @returns {void}
	 */
	del(address) {
		const addressHex = bytesToUnprefixedHex(address.bytes)

		this._saveCachePreState(addressHex)
		this._stats.deletions++

		// Mark as deleted (accountRLP: undefined means known to not exist)
		/** @type {AccountCacheElement} */
		const elem = { accountRLP: undefined }

		if (this._lruCache) {
			this._lruCache.set(addressHex, elem)
		} else if (this._orderedMapCache) {
			this._orderedMapCache.set(addressHex, elem)
		}
	}

	/**
	 * Flushes cache by returning accounts that have been modified
	 * or deleted and resetting the diff cache (at checkpoint height).
	 * @returns {Array<[string, AccountCacheElement]>} Array of [addressHex, element]
	 */
	flush() {
		/** @type {Array<[string, AccountCacheElement]>} */
		const result = []

		if (this._checkpoints === 0) {
			return result
		}

		const diffMap = this._diffCache[this._checkpoints - 1]
		if (!diffMap) {
			return result
		}

		for (const [addressHex] of diffMap) {
			// Get current element
			const currentElem = this._getByHex(addressHex)
			if (currentElem !== undefined) {
				result.push([addressHex, currentElem])
			}
		}

		// Reset diff cache at current level
		this._diffCache[this._checkpoints - 1] = new Map()

		return result
	}

	/**
	 * Revert changes to cache last checkpoint (no effect on trie).
	 * @returns {void}
	 */
	revert() {
		if (this._checkpoints === 0) return

		const diffMap = this._diffCache.pop()
		this._checkpoints--

		if (!diffMap) return

		// Restore all pre-states
		for (const [addressHex, preElem] of diffMap) {
			if (preElem === undefined) {
				// Account didn't exist in cache before - remove it
				if (this._lruCache) {
					this._lruCache.delete(addressHex)
				} else if (this._orderedMapCache) {
					this._orderedMapCache.delete(addressHex)
				}
			} else {
				// Restore previous element
				if (this._lruCache) {
					this._lruCache.set(addressHex, preElem)
				} else if (this._orderedMapCache) {
					this._orderedMapCache.set(addressHex, preElem)
				}
			}
		}
	}

	/**
	 * Commits to current state of cache (no effect on trie).
	 * @returns {void}
	 */
	commit() {
		if (this._checkpoints === 0) return

		this._diffCache.pop()
		this._checkpoints--
	}

	/**
	 * Marks current state of cache as checkpoint, which can
	 * later on be reverted or committed.
	 * @returns {void}
	 */
	checkpoint() {
		this._checkpoints++
		this._diffCache.push(new Map())
	}

	/**
	 * Returns the size of the cache
	 * @returns {number}
	 */
	size() {
		if (this._lruCache) {
			return this._lruCache.size
		} else if (this._orderedMapCache) {
			return this._orderedMapCache.size
		}
		return 0
	}

	/**
	 * Returns a dict with cache stats
	 * @param {boolean} [reset] - Whether to reset stats after returning
	 * @returns {{size: number, reads: number, hits: number, writes: number, deletions: number}}
	 */
	stats(reset = false) {
		const result = { ...this._stats, size: this.size() }
		if (reset) {
			this._stats = { size: 0, reads: 0, hits: 0, writes: 0, deletions: 0 }
		}
		return result
	}

	/**
	 * Clears cache.
	 * @returns {void}
	 */
	clear() {
		if (this._lruCache) {
			this._lruCache.clear()
		} else if (this._orderedMapCache) {
			this._orderedMapCache.clear()
		}
		this._diffCache = []
		this._checkpoints = 0
	}
}
