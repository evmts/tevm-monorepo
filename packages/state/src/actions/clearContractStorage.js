/**
 * Clears all storage entries for the account corresponding to `address`.
 * @type {import("../state-types/index.js").StateAction<'clearContractStorage'>}
 */
export const clearContractStorage = (baseState) => (address) => {
	// Use the new clearStorage method from the updated StorageCache
	baseState.caches.storage.clearStorage(address)
	baseState.logger.debug({ address: address.toString() }, 'State manager cleared storage at address.')
	return Promise.resolve()
}
