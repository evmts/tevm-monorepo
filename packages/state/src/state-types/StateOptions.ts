import type { AccountCache, StorageCache } from '@ethereumjs/statemanager'
import type { LogOptions } from '@tevm/logger'
import type { Hex } from 'viem'
import type { BaseState } from '../BaseState.js'
import type { ContractCache } from '../ContractCache.js'
import type { ForkOptions } from './ForkOptions.js'
import type { StateRoots } from './StateRoots.js'
import type { TevmState } from './TevmState.js'

/**
 * Configuration options for the Tevm state manager.
 * Controls forking, initial state, caching, and event handling.
 * @example
 * ```typescript
 * import { StateOptions } from '@tevm/state'
 * import { http } from 'viem'
 *
 * const value: StateOptions = {
 *   fork: {
 *     transport: http('https://mainnet.infura.io/v3/your-api-key'),
 *     blockTag: 'latest'
 *   },
 *   loggingLevel: 'debug'
 * }
 * ```
 */
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
	/**
	 * Optionally configure and pass in your own ContractCache
	 */
	readonly contractCache?: ContractCache
	/**
	 * Optionally configure and pass in your own StorageCache
	 */
	readonly storageCache?: StorageCache
	/**
	 * Optionally configure the accounts cache
	 */
	readonly accountsCache?: AccountCache
}
