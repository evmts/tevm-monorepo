import type { SerializableTevmState } from '@tevm/state'

export type SyncStoragePersister = {
	persistTevmState: (state: SerializableTevmState) => void
	restoreState: () => SerializableTevmState | undefined
	removePersistedState: () => void
}
