import { StorageCache, CacheType, bytesToUnprefixedHex } from '@tevm/utils'

const oneBytes = Uint8Array.from([1])

/**
 * Contract cache is a mapping of addresses to deployedBytecode
 * It is implemented via extending StorageCache and hardcoding slot 0
 */
export class ContractCache {
	constructor(
		storageCache = new StorageCache({
			size: 100_000,
			type: CacheType.LRU,
		}),
	) {
		this.storageCache = storageCache
	}

	/**
	 * @returns {void}
	 */
	commit() {
		this.storageCache.commit()
	}

	/**
	 * @returns {void}
	 */
	clear() {
		this.storageCache.clear()
	}

	/**
	 * @param {import('@tevm/utils').EthjsAddress} address
	 * @returns {Uint8Array | undefined}
	 */
	get(address) {
		return this.storageCache.get(address, oneBytes)
	}

	/**
	 * @param {import('@tevm/utils').EthjsAddress} address
	 * @param {Uint8Array} bytecode
	 * @returns {void}
	 */
	put(address, bytecode) {
		this.storageCache.put(address, oneBytes, bytecode)
	}

	/**
	 * @param {import('@tevm/utils').EthjsAddress} address
	 * @returns {void}
	 */
	del(address) {
		this.storageCache.del(address, oneBytes)
	}

	/**
	 * @returns {void}
	 */
	checkpoint() {
		this.storageCache.checkpoint()
	}

	/**
	 * @param {import('@tevm/utils').EthjsAddress} address
	 * @returns {boolean} if the cache has the key
	 */
	has(address) {
		const addressHex = bytesToUnprefixedHex(address.bytes)
		const keyHex = bytesToUnprefixedHex(oneBytes)

		// Check ordered map cache (native Map uses .get())
		const orderedStorageMap = this.storageCache._orderedMapCache?.get(addressHex)
		const hasOrderedMapCache = orderedStorageMap?.has(keyHex) ?? false

		// Check LRU cache
		const lruStorageMap = this.storageCache._lruCache?.get(addressHex)
		const hasLruCache = lruStorageMap?.has(keyHex) ?? false

		return Boolean(hasOrderedMapCache || hasLruCache)
	}

	get _checkpoints() {
		return this.storageCache._checkpoints
	}

	size() {
		return this.storageCache.size()
	}

	/**
	 * @returns {void}
	 */
	revert() {
		this.storageCache.revert()
	}
}
