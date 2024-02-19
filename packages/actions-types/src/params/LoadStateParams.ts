import type { BaseParams } from './BaseParams.js'
import type { SerializableTevmState } from '@tevm/state'

/**
 * params for `tevm_loadState` method. Takes a {@link SerializableTevmState} to load into state.
 */
export type LoadStateParams<TThrowOnFail extends boolean = boolean> =
	BaseParams<TThrowOnFail> & {
		state: SerializableTevmState
	}
