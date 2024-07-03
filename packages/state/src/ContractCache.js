import { CacheType, StorageCache } from '@ethereumjs/statemanager'
import { bytesToUnprefixedHex } from '@tevm/utils'

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
		const storageMap = this.storageCache._orderedMapCache?.getElementByKey(bytesToUnprefixedHex(address.bytes))
		const hasOrderedMapCache = storageMap?.has(bytesToUnprefixedHex(oneBytes)) ?? false
		const hasLruCache = this.storageCache._lruCache?.has(bytesToUnprefixedHex(address.bytes))
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
