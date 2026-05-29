import { InvalidParamsError } from '@tevm/errors'
import { bytesToHex, getAddress, hexToBigInt } from '@tevm/utils'

/**
 * @type {import("../state-types/index.js").StateAction<'dumpStorageRange'>}
 */
export const dumpStorageRange = (state) => (_address, _startKey, _limit) => {
	const storage = state.caches.storage.dump(_address)
	if (!storage) {
		throw new InvalidParamsError(`No storage found at address ${getAddress(_address.toString())}`)
	}
	/**
	 * @type {Array<[import("viem").Hex, {key: import("@tevm/utils").Hex, value: import('@tevm/utils').Hex}]>}
	 */
	const entries = []
	/**
	 * @type {import("viem").Hex | null}
	 */
	let nextKey = null
	// StorageCache.dump() returns keys as UNPREFIXED hex (e.g. '00..0a'), so they must be 0x-prefixed
	// before parsing. Otherwise hexToBigInt throws on hex letters and parses all-digit keys as decimal.
	const sortedStorage = [...storage.entries()].sort(([a], [b]) => {
		const aBigInt = hexToBigInt(/** @type {import('@tevm/utils').Hex}*/ (`0x${a}`))
		const bBigInt = hexToBigInt(/** @type {import('@tevm/utils').Hex}*/ (`0x${b}`))
		return aBigInt < bBigInt ? -1 : aBigInt > bBigInt ? 1 : 0
	})
	for (const [storageKey, storageValue] of sortedStorage) {
		if (hexToBigInt(/** @type {import('@tevm/utils').Hex}*/ (`0x${storageKey}`)) < _startKey) {
			continue
		}
		if (entries.length === _limit) {
			nextKey = /** @type {import("@tevm/utils").Hex}*/ (storageKey)
			break
		}
		const key = /** @type {import("@tevm/utils").Hex}*/ (storageKey)
		const value = bytesToHex(storageValue)
		entries.push([key, { key, value }])
	}
	return Promise.resolve({
		nextKey,
		storage: Object.fromEntries(entries),
	})
}
