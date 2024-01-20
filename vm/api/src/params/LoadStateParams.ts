import type { SerializableTevmState } from '@tevm/state'

/**
 * params for `tevm_loadState` method. Takes a {@link SerializableTevmState} to load into state.
 */
export type LoadStateParams = {
	state: SerializableTevmState
}
