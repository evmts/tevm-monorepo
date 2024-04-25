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
	_currentStateRoot: Uint8Array
	_options: StateOptions
	_caches: StateCache
}
