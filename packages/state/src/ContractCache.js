import { CacheType, StorageCache } from '@ethereumjs/statemanager'

const zeroBytes = Uint8Array.from([])

/**
 * Contract cache is a mapping of addresses to deployedBytecode
 * It is implemented via extending StorageCache and hardcoding slot 0
 */
export class ContractCache {
	constructor(
		storageCache = new StorageCache({
			size: 100000,
			type: CacheType.ORDERED_MAP,
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
		return this.storageCache.get(address, zeroBytes)
	}

	/**
	 * @param {import('@tevm/utils').EthjsAddress} address
	 * @param {Uint8Array} bytecode
	 * @returns {void}
	 */
	put(address, bytecode) {
		this.storageCache.put(address, zeroBytes, bytecode)
	}

	/**
	 * @param {import('@tevm/utils').EthjsAddress} address
	 * @returns {void}
	 */
	del(address) {
		this.storageCache.del(address, zeroBytes)
	}

	/**
	 * @returns {void}
	 */
	checkpoint() {
		this.storageCache.checkpoint()
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