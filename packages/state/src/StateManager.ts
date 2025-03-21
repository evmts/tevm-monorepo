import type { StateManagerInterface } from '@tevm/common'
import type { Address } from 'viem'
import type { BaseState } from './BaseState.js'
import type { TevmState } from './state-types/index.js'

export interface StateManager extends StateManagerInterface {
	/**
	 * The internal state representation
	 */
	_baseState: BaseState
	ready: BaseState['ready']
	/**
	 * Returns contract addresses
	 */
	getAccountAddresses: () => Set<Address>
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
	/**
	 * @experimental
	 * Saves a state root to the state root mapping
	 * THis API is considered unstable
	 */
	saveStateRoot(root: Uint8Array, state: TevmState): void
	/**
	 * Commits the current state.
	 */
	commit(
		/**
		 * @experimental
		 * Whether to create a new state root
		 * Defaults to true.
		 * This api is not stable
		 */
		createNewStateRoot?: boolean,
	): Promise<void>
}
