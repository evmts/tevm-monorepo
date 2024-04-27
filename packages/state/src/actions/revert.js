/**
 * Commits the current change-set to the instance since the
 * last call to checkpoint.
 * @type {import("../state-types/index.js").StateAction<'revert'>}
 */
export const revert = (baseState) => () => {
	baseState._caches.accounts.revert()
	baseState._caches.storage.revert()
	baseState._caches.contracts.revert()
	return Promise.resolve()
}
