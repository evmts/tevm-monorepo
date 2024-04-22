import type { EvmStateManagerInterface } from '@tevm/common'
import type { Address } from 'viem'
import type { BaseState } from './BaseState.js'
import type { TevmState } from './state-types/index.js'

export interface StateManager extends EvmStateManagerInterface, BaseState {
	/**
	 * Returns contract addresses
	 */
	getAccountAddresses: () => Address[]
	/**
	 * Returns a new instance of the ForkStateManager with the same opts and all storage copied over
	 */
	deepCopy(): Promise<StateManager>
	/**
	 * Dumps the state of the state manager as a {@link TevmState}
	 */
	dumpCanonicalGenesis(): Promise<TevmState>
	/**
	 * Resets all internal caches
	 */
	clearCaches(): void
}
