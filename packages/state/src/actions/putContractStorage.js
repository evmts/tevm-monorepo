import { getAccount } from './getAccount.js'

/**
 * @param {Uint8Array} bytes
 * @returns {Uint8Array}
 */
const stripZeros = (bytes) => {
	if (!(bytes instanceof Uint8Array)) {
		throw new Error('Unexpected type')
	}
	let out = bytes
	let first = out[0]
	while (out.length > 0 && first === 0) {
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
export const putContractStorage = (baseState) => async (address, key, value) => {
	if (key.length !== 32) {
		throw new Error('Storage key must be 32 bytes long!')
	}

	const account = await getAccount(baseState)(address)
	if (!account) {
		throw new Error('cannot putContractStorage on non existing acccount!')
	}
	baseState._caches.storage.put(address, key, stripZeros(value))
}
