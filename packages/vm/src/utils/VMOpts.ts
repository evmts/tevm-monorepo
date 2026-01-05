import type { Chain } from '@tevm/blockchain'
import type { Common } from '@tevm/common'
import type { Evm } from '@tevm/evm'
import type { StateManager } from '@tevm/state'
import type { BigIntLike, GenesisState } from '@tevm/utils'
import type { VMProfilerOpts } from './VMProfileOpts.js'

/**
 * Options for instantiating a {@link VM}.
 */
export interface VMOpts {
	/**
	 * Use a {@link Common} instance
	 * if you want to change the chain setup.
	 *
	 * ### Possible Values
	 *
	 * - `chain`: all chains supported by `Common` or a custom chain
	 * - `hardfork`: `mainnet` hardforks up to the `Paris` hardfork
	 * - `eips`: `2537` (usage e.g. `eips: [ 2537, ]`)
	 *
	 * Note: check the associated {@link Evm} instance options
	 * documentation for supported EIPs.
	 *
	 * ### Default Setup
	 *
	 * Default setup if no `Common` instance is provided:
	 *
	 * - `chain`: `mainnet`
	 * - `hardfork`: `paris`
	 * - `eips`: `[]`
	 */
	common?: Common
	/**
	 * A {@link StateManager} instance to use as the state store
	 */
	stateManager?: StateManager
	/**
	 * A {@link Blockchain} object for storing/retrieving blocks
	 */
	blockchain?: Chain
	/**
	 * If true, create entries in the state tree for the precompiled contracts, saving some gas the
	 * first time each of them is called.
	 *
	 * If this parameter is false, each call to each of them has to pay an extra 25000 gas
	 * for creating the account. If the account is still empty after this call, it will be deleted,
	 * such that this extra cost has to be paid again.
	 *
	 * Setting this to true has the effect of precompiled contracts' gas costs matching mainnet's from
	 * the very first call, which is intended for testing networks.
	 *
	 * Default: `false`
	 */
	activatePrecompiles?: boolean
	/**
	 * A genesisState to generate canonical genesis for the "in-house" created stateManager if external
	 * stateManager not provided for the VM, defaults to an empty state
	 */
	genesisState?: GenesisState

	/**
	 * Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
	 * for older Hfs.
	 *
	 * Additionally it is possible to pass in a specific TD value to support live-Merge-HF
	 * transitions. Note that this should only be needed in very rare and specific scenarios.
	 *
	 * Default: `false` (HF is set to whatever default HF is set by the {@link Common} instance)
	 */
	setHardfork?: boolean | BigIntLike

	/**
	 * Use a custom EVM to run Messages on. If this is not present, use the default EVM.
	 */
	evm?: Evm

	profilerOpts?: VMProfilerOpts
}
