import { bytesToUnprefixedHex } from '@tevm/utils'
import { LRUCache } from 'lru-cache'

/**
 * Simple LRU Cache that allows for keys of type Uint8Array
 * @hidden
 */
export class Cache<V> {
	_cache: LRUCache<string, { value: V }, void>

	constructor(opts: LRUCache.Options<string, { value: V }, void>) {
		this._cache = new LRUCache(opts)
	}

	set(key: string | Uint8Array, value: V): void {
		this._cache.set(
			key instanceof Uint8Array ? bytesToUnprefixedHex(key) : key,
			{ value },
		)
	}

	get(key: string | Uint8Array): V | undefined {
		const elem = this._cache.get(
			key instanceof Uint8Array ? bytesToUnprefixedHex(key) : key,
		)
		return elem !== undefined ? elem.value : undefined
	}

	del(key: string | Uint8Array): void {
		this._cache.delete(
			key instanceof Uint8Array ? bytesToUnprefixedHex(key) : key,
		)
	}
}
