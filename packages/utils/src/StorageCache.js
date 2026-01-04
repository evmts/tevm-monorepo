import { LRUCache } from 'lru-cache'
import { CacheType } from './cache-types.js'
import { bytesToUnprefixedHex } from './bytesToUnprefixedHex.js'

/**
 * Storage cache element type - maps storage key to value
 * undefined means slot is known not to exist in cache
 * @typedef {Map<string, Uint8Array>} StorageCacheMap
 */

/**
 * Diff cache for storage - tracks changes during checkpoints
 * @typedef {Map<string, Uint8Array | undefined>} DiffStorageCacheMap
 */

/**
 * Native StorageCache implementation for tevm, replacing @ethereumjs/statemanager StorageCache.
 *
 * Implements checkpoint/revert/commit functionality for storage slot caching.
 * Supports both LRU and ordered map cache types.
 *
 * @example
 * ```javascript
 * import { StorageCache, CacheType } from '@tevm/utils'
 *
 * const cache = new StorageCache({ size: 100000, type: CacheType.LRU })
 *
 * // Store a value
 * cache.put(address, storageKey, storageValue)
 *
 * // Retrieve a value
 * const value = cache.get(address, storageKey)
 *
 * // Checkpoint/revert support
 * cache.checkpoint()
 * cache.put(address, storageKey, newValue)
 * cache.revert() // restores previous value
 * ```
 */
export class StorageCache {
	/**
	 * Number of active checkpoints
	 * @type {number}
	 */
	_checkpoints = 0

	/**
	 * LRU cache instance (used when type is LRU)
	 * @type {LRUCache<string, StorageCacheMap> | undefined}
	 */
	_lruCache

	/**
	 * Ordered map cache instance (used when type is ORDERED_MAP)
	 * @type {Map<string, StorageCacheMap> | undefined}
	 */
	_orderedMapCache

	/**
	 * Diff cache for checkpoint/revert support
	 * Each array element represents a checkpoint level
	 * @type {Map<string, DiffStorageCacheMap>[]}
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
	 * Creates a new StorageCache instance
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
	 * @param {string} addressHex - Hex address string
	 * @param {string} keyHex - Hex storage key string
	 */
	_saveCachePreState(addressHex, keyHex) {
		if (this._checkpoints === 0) return

		const diffMap = this._diffCache[this._checkpoints - 1]
		if (!diffMap) return

		let addressDiff = diffMap.get(addressHex)
		if (addressDiff === undefined) {
			addressDiff = new Map()
			diffMap.set(addressHex, addressDiff)
		}

		// Only save if not already saved at this checkpoint level
		if (!addressDiff.has(keyHex)) {
			// Get current value (may be undefined if not in cache)
			const currentVal = this.get({ bytes: hexToBytes(addressHex) }, hexToBytes(keyHex))
			addressDiff.set(keyHex, currentVal)
		}
	}

	/**
	 * Puts storage value to cache under address_key cache key.
	 * @param {import('./EthjsAddress.js').EthjsAddress} address - Account address
	 * @param {Uint8Array} key - Storage key
	 * @param {Uint8Array} value - RLP-encoded storage value
	 * @returns {void}
	 */
	put(address, key, value) {
		const addressHex = bytesToUnprefixedHex(address.bytes)
		const keyHex = bytesToUnprefixedHex(key)

		this._saveCachePreState(addressHex, keyHex)
		this._stats.writes++

		if (this._lruCache) {
			let storageMap = this._lruCache.get(addressHex)
			if (!storageMap) {
				storageMap = new Map()
				this._lruCache.set(addressHex, storageMap)
			}
			storageMap.set(keyHex, value)
		} else if (this._orderedMapCache) {
			let storageMap = this._orderedMapCache.get(addressHex)
			if (!storageMap) {
				storageMap = new Map()
				this._orderedMapCache.set(addressHex, storageMap)
			}
			storageMap.set(keyHex, value)
		}
	}

	/**
	 * Returns the queried slot as the RLP encoded storage value
	 * hexToBytes('0x80'): slot is known to be empty
	 * undefined: slot is not in cache
	 * @param {import('./EthjsAddress.js').EthjsAddress} address - Address of account
	 * @param {Uint8Array} key - Storage key
	 * @returns {Uint8Array | undefined} Storage value or undefined
	 */
	get(address, key) {
		const addressHex = bytesToUnprefixedHex(address.bytes)
		const keyHex = bytesToUnprefixedHex(key)

		this._stats.reads++

		let storageMap
		if (this._lruCache) {
			storageMap = this._lruCache.get(addressHex)
		} else if (this._orderedMapCache) {
			storageMap = this._orderedMapCache.get(addressHex)
		}

		if (storageMap) {
			const value = storageMap.get(keyHex)
			if (value !== undefined) {
				this._stats.hits++
				return value
			}
		}
		return undefined
	}

	/**
	 * Marks storage key for address as deleted in cache.
	 * @param {import('./EthjsAddress.js').EthjsAddress} address - Address
	 * @param {Uint8Array} key - Storage key
	 * @returns {void}
	 */
	del(address, key) {
		const addressHex = bytesToUnprefixedHex(address.bytes)
		const keyHex = bytesToUnprefixedHex(key)

		this._saveCachePreState(addressHex, keyHex)
		this._stats.deletions++

		if (this._lruCache) {
			const storageMap = this._lruCache.get(addressHex)
			if (storageMap) {
				storageMap.delete(keyHex)
			}
		} else if (this._orderedMapCache) {
			const storageMap = this._orderedMapCache.get(addressHex)
			if (storageMap) {
				storageMap.delete(keyHex)
			}
		}
	}

	/**
	 * Deletes all storage slots for address from the cache
	 * @param {import('./EthjsAddress.js').EthjsAddress} address - Address
	 * @returns {void}
	 */
	clearStorage(address) {
		const addressHex = bytesToUnprefixedHex(address.bytes)

		if (this._lruCache) {
			this._lruCache.delete(addressHex)
		} else if (this._orderedMapCache) {
			this._orderedMapCache.delete(addressHex)
		}
	}

	/**
	 * Flushes cache by returning storage slots that have been modified
	 * or deleted and resetting the diff cache (at checkpoint height).
	 * @returns {Array<[string, string, Uint8Array | undefined]>} Array of [addressHex, keyHex, value]
	 */
	flush() {
		/** @type {Array<[string, string, Uint8Array | undefined]>} */
		const result = []

		if (this._checkpoints === 0) {
			return result
		}

		const diffMap = this._diffCache[this._checkpoints - 1]
		if (!diffMap) {
			return result
		}

		for (const [addressHex, keyMap] of diffMap) {
			for (const [keyHex] of keyMap) {
				// Get current value
				const currentVal = this._getByHex(addressHex, keyHex)
				result.push([addressHex, keyHex, currentVal])
			}
		}

		// Reset diff cache at current level
		this._diffCache[this._checkpoints - 1] = new Map()

		return result
	}

	/**
	 * Get value by hex keys (internal helper)
	 * @param {string} addressHex
	 * @param {string} keyHex
	 * @returns {Uint8Array | undefined}
	 */
	_getByHex(addressHex, keyHex) {
		let storageMap
		if (this._lruCache) {
			storageMap = this._lruCache.get(addressHex)
		} else if (this._orderedMapCache) {
			storageMap = this._orderedMapCache.get(addressHex)
		}
		return storageMap?.get(keyHex)
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
		for (const [addressHex, keyMap] of diffMap) {
			for (const [keyHex, preValue] of keyMap) {
				if (preValue === undefined) {
					// Key didn't exist before - delete it
					if (this._lruCache) {
						const storageMap = this._lruCache.get(addressHex)
						if (storageMap) {
							storageMap.delete(keyHex)
						}
					} else if (this._orderedMapCache) {
						const storageMap = this._orderedMapCache.get(addressHex)
						if (storageMap) {
							storageMap.delete(keyHex)
						}
					}
				} else {
					// Restore previous value
					if (this._lruCache) {
						let storageMap = this._lruCache.get(addressHex)
						if (!storageMap) {
							storageMap = new Map()
							this._lruCache.set(addressHex, storageMap)
						}
						storageMap.set(keyHex, preValue)
					} else if (this._orderedMapCache) {
						let storageMap = this._orderedMapCache.get(addressHex)
						if (!storageMap) {
							storageMap = new Map()
							this._orderedMapCache.set(addressHex, storageMap)
						}
						storageMap.set(keyHex, preValue)
					}
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
		let count = 0
		if (this._lruCache) {
			for (const storageMap of this._lruCache.values()) {
				count += storageMap.size
			}
		} else if (this._orderedMapCache) {
			for (const storageMap of this._orderedMapCache.values()) {
				count += storageMap.size
			}
		}
		return count
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

	/**
	 * Dumps the RLP-encoded storage values for an account specified by address.
	 * @param {import('./EthjsAddress.js').EthjsAddress} address - The address of the account
	 * @returns {StorageCacheMap | undefined} - The storage values or undefined
	 */
	dump(address) {
		const addressHex = bytesToUnprefixedHex(address.bytes)

		if (this._lruCache) {
			return this._lruCache.get(addressHex)
		} else if (this._orderedMapCache) {
			return this._orderedMapCache.get(addressHex)
		}
		return undefined
	}
}

/**
 * Helper to convert hex string to bytes
 * @param {string} hex
 * @returns {Uint8Array}
 */
function hexToBytes(hex) {
	const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex
	const bytes = new Uint8Array(cleanHex.length / 2)
	for (let i = 0; i < bytes.length; i++) {
		bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16)
	}
	return bytes
}
