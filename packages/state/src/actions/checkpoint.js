/**
 * Checkpoints the current change-set to the instance since the
 * last call to checkpoint.
 * @type {import("../state-types/index.js").StateAction<'checkpoint'>}
 */
export const checkpoint = (baseState) => () => {
	baseState._caches.accounts.checkpoint()
	baseState._caches.storage.checkpoint()
	baseState._caches.contracts.checkpoint()
	return Promise.resolve()
}
