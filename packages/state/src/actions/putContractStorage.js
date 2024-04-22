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
		storage.put(address, key, value)
	}
