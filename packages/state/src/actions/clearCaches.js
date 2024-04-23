/**
 * Resets all internal caches
 * @type {import("../state-types/index.js").StateAction<'clearCaches'>}
 */
export const clearCaches = (baseClient) => () => {
  baseClient._caches.storage.clear()
  baseClient._caches.contracts.clear()
  baseClient._caches.accounts.clear()
}
