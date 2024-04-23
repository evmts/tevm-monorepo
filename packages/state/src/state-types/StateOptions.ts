import type { BaseState } from '../BaseState.js'
import type { ForkOptions } from './ForkOptions.js'
import type { StateRoots } from './StateRoots.js'
import type { TevmState } from './TevmState.js'

export type StateOptions = {
	fork?: ForkOptions
	genesisState?: TevmState
	stateRoots?: StateRoots
	/**
	 * Called when state manager commits state
	 */
	onCommit?: (stateManager: BaseState) => void
}
