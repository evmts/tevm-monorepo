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
	 * @type {Array<[import("@tevm/utils").Hex, {key: import("@tevm/utils").Hex, value: import('@tevm/utils').Hex}]>}
	 */
	const entries = []
	/**
	 * @type {import("@tevm/utils").Hex | null}
	 */
	let nextKey = null
	let started = false
	for (const [storageKey, storageValue] of storage.entries()) {
		// Ensure storageKey has 0x prefix
		const keyWithPrefix = /** @type {import("@tevm/utils").Hex}*/ (
			storageKey.startsWith('0x') ? storageKey : `0x${storageKey}`
		)
		if (entries.length === _limit) {
			nextKey = keyWithPrefix
			break
		}
		if (!started) {
			if (hexToBigInt(keyWithPrefix) === _startKey) {
				started = true
			} else {
				continue
			}
		}
		const key = keyWithPrefix
		const value = bytesToHex(storageValue)
		entries.push([key, { key, value }])
	}
	return Promise.resolve({
		nextKey,
		storage: Object.fromEntries(entries),
	})
}
