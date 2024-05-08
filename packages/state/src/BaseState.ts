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
	stateRoots: StateRoots
	options: StateOptions
	caches: StateCache
	getCurrentStateRoot: () => Hex
	setCurrentStateRoot: (newStateRoot: Hex) => void
}
