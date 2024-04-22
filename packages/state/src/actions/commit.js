/**
 * Commits the current change-set to the instance since the
 * last call to checkpoint.
 * @type {import("../state-types/index.js").StateAction<'commit'>}
 */
export const commit = (baseState) => () => {
	baseState._caches.accounts.commit()
	baseState._caches.storage.commit()
	baseState._caches.contracts.commit()
	baseState._options.onCommit?.(baseState)
	return Promise.resolve()
}
