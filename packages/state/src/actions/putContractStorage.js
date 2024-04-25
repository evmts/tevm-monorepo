import { Rlp } from '@tevm/rlp'
/**
 * Trims leading zeros from a `Uint8Array`
 * @param {Uint8Array} bytes
 */
const stripZeros = (bytes) => {
	let out = bytes
	let first = out[0]
	while (out.length > 0 && first?.toString() === '0') {
		out = out.slice(1)
		first = out[0]
	}
	return out
}

/**
 * Adds value to the cache for the `account`
 * corresponding to `address` at the provided `key`.
 * Cannot be more than 32 bytes. Leading zeros are stripped.
 * If it is empty or filled with zeros, deletes the value.
 * @type {import("../state-types/index.js").StateAction<'putContractStorage'>}
 */
export const putContractStorage =
	({ _caches: { storage } }) =>
	async (address, key, value) => {
		const encodedValue = Rlp.encode(stripZeros(value))
		storage.put(address, key, encodedValue)
	}
