import type { SerializableTevmState } from '@tevm/state'

/**
 * Storage persister for client state
 */
export type SyncStoragePersister = {
	/**
	 * Persist serializable tevm state
	 * @param state - State to be persisted
	 * @param onError - Called when state fails to persist
	 * @returns Error if one occurs during persistence
	 */
	persistTevmState: (
		state: SerializableTevmState | undefined,
		onError?: (error: Error | undefined) => void,
	) => Error | undefined
	/**
	 * Restores persisted state
	 * @returns The persisted state if it exists
	 */
	restoreState: () => SerializableTevmState | undefined
	/**
	 * Removes persisted state
	 * @returns Error if one occurs during removal
	 */
	removePersistedState: () => Error | undefined
}
