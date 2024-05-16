import type { LogOptions } from '@tevm/logger'
import type { Hex } from 'viem'
import type { BaseState } from '../BaseState.js'
import type { ForkOptions } from './ForkOptions.js'
import type { StateRoots } from './StateRoots.js'
import type { TevmState } from './TevmState.js'

export type StateOptions = {
	fork?: ForkOptions
	genesisState?: TevmState
	currentStateRoot?: Hex
	stateRoots?: StateRoots
	/**
	 * Called when state manager commits state
	 */
	onCommit?: (stateManager: BaseState) => void
	/**
	 * Configure logging options for the client
	 */
	readonly loggingLevel?: LogOptions['level']
}
