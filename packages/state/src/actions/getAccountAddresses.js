import { getAddress } from '@tevm/utils'

/**
 * @type {import("../state-types/index.js").StateAction<'getAccountAddresses'>}
 */
export const getAccountAddresses = (baseState) => () => {
	/**
	 * @type {Set<import('@tevm/utils').Address>}
	 */
	const accountAddresses = new Set()
	//Tevm initializes stateManager account cache with an ordered map cache
	baseState.caches.accounts._orderedMapCache?.forEach((e) => {
		accountAddresses.add(getAddress(e[0].startsWith('0x') ? e[0] : `0x${e[0]}`))
	})
	const { _lruCache, _orderedMapCache } = baseState.caches.accounts
	if (_lruCache !== undefined) {
		for (const address of _lruCache.rkeys()) {
			accountAddresses.add(getAddress(address.startsWith('0x') ? address : `0x${address}`))
		}
	}
	if (_orderedMapCache !== undefined) {
		_orderedMapCache.forEach(([address]) => {
			accountAddresses.add(getAddress(address.startsWith('0x') ? address : `0x${address}`))
		})
	}

	return accountAddresses
}
