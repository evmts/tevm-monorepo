/**
 * Resets all internal caches
 * @type {import("../state-types/index.js").StateAction<'clearCaches'>}
 */
export const clearCaches = (baseClient) => () => {
	baseClient.caches.storage.clear()
	baseClient.caches.contracts.clear()
	baseClient.caches.accounts.clear()
}
