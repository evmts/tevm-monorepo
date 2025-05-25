/**
 * Clears all storage entries for the account corresponding to `address`.
 * @param {import('../BaseState.js').BaseState} baseState
 * @returns {(address: import('@tevm/utils').EthjsAddress) => Promise<void>}
 */
export const clearContractStorage = (baseState) => (address) => {
	// Use the new clearStorage method from the updated StorageCache
	baseState.caches.storage.clearStorage(address)
	baseState.logger.debug({ address: address.toString() }, 'State manager cleared storage at address.')
	return Promise.resolve()
}
