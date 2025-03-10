import type { Logger } from '@tevm/logger'
import type { Hex } from '@tevm/utils'
import type { StateCache, StateOptions, StateRoots } from './state-types/index.js'

/**
 * @internal
 * The core data structure powering the state manager internally
 */
export type BaseState = {
	// Returns true when ready
	ready: () => Promise<true>
	logger: Logger
	/**
	 * Mapping of hashes to State roots
	 */
	stateRoots: StateRoots
	options: StateOptions
	caches: StateCache
	// Cache that only stores items forked from fork url. Normal cache is source of truth if the value changed after
	forkCache: StateCache
	getCurrentStateRoot: () => Hex
	setCurrentStateRoot: (newStateRoot: Hex) => void
}
