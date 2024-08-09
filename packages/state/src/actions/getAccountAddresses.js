import { getAddress } from '@tevm/utils'

/**
 * @type {import("../state-types/index.js").StateAction<'getAccountAddresses'>}
 */
export const getAccountAddresses = (baseState) => () => {
	/**
	 * @type {Array<import('@tevm/utils').Address>}
	 */
	const accountAddresses = []
	//Tevm initializes stateManager account cache with an ordered map cache
	baseState.caches.accounts._orderedMapCache?.forEach((e) => {
		accountAddresses.push(getAddress(e[0].startsWith('0x') ? e[0] : `0x${e[0]}`))
	})
	const { _lruCache, _orderedMapCache } = baseState.caches.accounts
	if (_lruCache !== undefined) {
		for (const address of _lruCache.rkeys()) {
			accountAddresses.push(getAddress(address.startsWith('0x') ? address : `0x${address}`))
		}
	}
	if (_orderedMapCache !== undefined) {
		_orderedMapCache.forEach(([address]) => {
			accountAddresses.push(getAddress(address.startsWith('0x') ? address : `0x${address}`))
		})
	}

	return accountAddresses
}
