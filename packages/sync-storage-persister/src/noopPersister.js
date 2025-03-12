/**
 * A persister that does nothing, useful as a default
 * @type {import('./SyncStoragePersister.js').SyncStoragePersister}
 */
export const noopPersister = {
	persistTevmState: () => undefined,
	restoreState: () => undefined,
	removePersistedState: () => undefined,
}
