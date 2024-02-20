import type { BaseParams } from './BaseParams.js'
import type { TevmState } from '@tevm/state'

/**
 * params for `tevm_loadState` method. Takes a {@link TevmState} to load into state.
 */
export type LoadStateParams<TThrowOnFail extends boolean = boolean> =
	BaseParams<TThrowOnFail> & {
		state: TevmState
	}
