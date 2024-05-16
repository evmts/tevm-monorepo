/**
 * Clears all storage entries for the account corresponding to `address`.
 * @type {import("../state-types/index.js").StateAction<'clearContractStorage'>}
 */
export const clearContractStorage = (baseState) => (address) => {
	baseState.caches.storage.clearContractStorage(address)
	baseState.logger.debug({ address: address.toString() }, 'State manager cleared at address.')
	return Promise.resolve()
}
