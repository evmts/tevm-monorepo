import type { Hex } from '@tevm/utils'
import type { StateCache, StateOptions, StateRoots } from './state-types/index.js'

/**
 * @internal
 * The core data structure powering the state manager internally
 */
export type BaseState = {
	// Returns true when ready
	ready: () => Promise<true>
	/**
	 * Mapping of hashes to State roots
	 */
	_stateRoots: StateRoots
	_currentStateRoot: Hex
	_options: StateOptions
	_caches: StateCache
}
