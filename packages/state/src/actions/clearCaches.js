/**
 * Resets all internal caches
 * @type {import("../state-types/index.js").StateAction<'clearCaches'>}
 */
export const clearCaches =
	({ _caches: { contracts, storage, accounts } }) =>
	() => {
		storage.clear()
		contracts.clear()
		accounts.clear()
	}
