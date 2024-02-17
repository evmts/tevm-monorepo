import type { SerializableTevmState } from '@tevm/state'

/**
 * params for `tevm_loadState` method. Takes a {@link SerializableTevmState} to load into state.
 */
export type LoadStateParams<TThrowOnFail extends boolean = boolean> = {
	state: SerializableTevmState
	/**
	 * Whether to throw on errors or return errors as value on the 'errors' property
	 * Defaults to `true`
	 */
	throwOnFail?: TThrowOnFail
}
