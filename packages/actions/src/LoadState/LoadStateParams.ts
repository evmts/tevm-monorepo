import type { SerializableTevmState } from '@tevm/state'
import type { BaseParams } from '../common/BaseParams.js'

/**
 * Parameters for the `tevmLoadState` method.
 *
 * This method takes a {@link SerializableTevmState} object and loads it into the VM state.
 *
 * @example
 * ```typescript
 * import { createClient } from 'tevm'
 * import { loadStateHandler } from 'tevm/actions'
 * import fs from 'fs'
 *
 * const client = createClient()
 * const loadState = loadStateHandler(client)
 *
 * const state = JSON.parse(fs.readFileSync('state.json'))
 * await loadState({ state })
 * ```
 *
 * @param {BaseParams} TThrowOnFail - Optional parameter to throw an error on failure.
 * @param {SerializableTevmState} state - The TEVM state object to load.
 */
export type LoadStateParams<TThrowOnFail extends boolean = boolean> = BaseParams<TThrowOnFail> & {
	/**
	 * The TEVM state object to load.
	 */
	readonly state: SerializableTevmState
}
