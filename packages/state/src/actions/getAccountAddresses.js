import { getAddress } from '@tevm/utils'

/**
 * @type {import("../state-types/index.js").StateAction<'getAccountAddresses'>}
 */
export const getAccountAddresses = (baseState) => () => {
	/**
	 * @type {Set<import('@tevm/utils').Address>}
	 */
	const accountAddresses = new Set()
	const { _lruCache, _orderedMapCache } = baseState.caches.accounts
	// Handle LRU cache
	if (_lruCache !== undefined) {
		for (const address of _lruCache.keys()) {
			accountAddresses.add(getAddress(address.startsWith('0x') ? address : `0x${address}`))
		}
	}
	// Handle ordered map cache (native Map uses .forEach((value, key)))
	if (_orderedMapCache !== undefined) {
		_orderedMapCache.forEach((_value, address) => {
			accountAddresses.add(getAddress(address.startsWith('0x') ? address : `0x${address}`))
		})
	}

	return accountAddresses
}
