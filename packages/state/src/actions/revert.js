/**
 * Commits the current change-set to the instance since the
 * last call to checkpoint.
 * @type {import("../state-types/index.js").StateAction<'revert'>}
 */
export const revert = (baseState) => () => {
	baseState.caches.accounts.revert()
	baseState.caches.storage.revert()
	baseState.caches.contracts.revert()
	baseState.logger.debug('State reverted')
	return Promise.resolve()
}
