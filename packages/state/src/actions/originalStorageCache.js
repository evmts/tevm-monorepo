import { bytesToUnprefixedHex } from '@tevm/utils'
import { getContractStorage } from './getContractStorage.js'

/**
 * Commits the current change-set to the instance since the
 * last call to checkpoint.
 * @type {import("../state-types/index.js").StateAction<'originalStorageCache'>}
 */
export const originalStorageCache = (baseState) => {
	const state = new Map()
	/**
	 * @param {import("@tevm/utils").EthjsAddress} address
	 * @param {Uint8Array} key
	 * @param {Uint8Array} value
	 */
	const put = (address, key, value) => {
		const addressHex = bytesToUnprefixedHex(address.bytes)
		let map = state.get(addressHex)
		if (map === undefined) {
			map = new Map()
			state.set(addressHex, map)
		}
		const keyHex = bytesToUnprefixedHex(key)
		if (map.has(keyHex) === false) {
			map.set(keyHex, value)
		}
	}

	return {
		async get(address, key) {
			const addressHex = bytesToUnprefixedHex(address.bytes)
			const map = state.get(addressHex)
			if (map !== undefined) {
				const keyHex = bytesToUnprefixedHex(key)
				const value = map.get(keyHex)
				if (value !== undefined) {
					return value
				}
			}
			const value = await getContractStorage(baseState)(address, key)
			put(address, key, value)
			return value
		},
		clear() {},
	}
}
