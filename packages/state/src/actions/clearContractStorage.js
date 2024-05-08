/**
 * Clears all storage entries for the account corresponding to `address`.
 * @type {import("../state-types/index.js").StateAction<'clearContractStorage'>}
 */
export const clearContractStorage = (baseState) => (address) => {
	baseState.caches.storage.clearContractStorage(address)
	return Promise.resolve()
}
