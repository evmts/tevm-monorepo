/**
 * Checkpoints the current change-set to the instance since the
 * last call to checkpoint.
 * @type {import("../state-types/index.js").StateAction<'checkpoint'>}
 */
export const checkpoint = (baseState) => () => {
	baseState.caches.accounts.checkpoint()
	baseState.caches.storage.checkpoint()
	baseState.caches.contracts.checkpoint()
	baseState.logger.debug('checkpointed state!')
	return Promise.resolve()
}
