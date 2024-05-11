/**
 * Resets all internal caches
 * @type {import("../state-types/index.js").StateAction<'clearCaches'>}
 */
export const clearCaches = (baseState) => () => {
	baseState.caches.storage.clear()
	baseState.caches.contracts.clear()
	baseState.caches.accounts.clear()
	baseState.logger.debug('State manager cleared.')
}
