import { type Chain } from '@tevm/blockchain'
import { type Common } from '@tevm/common'
import { type EvmType } from '@tevm/evm'
import { type StateManager } from '@tevm/state'

/**
 * Options for instantiating a VM.
 */
export interface VmOpts {
	/**
	 * Use a {@link Common} instance
	 * if you want to change the chain setup.
	 *
	 * ### Possible Values
	 *
	 * - `chain`: all chains supported by `Common` or a custom chain
	 * - `hardfork`: `mainnet` hardforks up to the `Paris` hardfork
	 * - `eips`: `1559` (usage e.g. `eips: [ 1559, ]`)
	 *
	 * Note: check the associated `@ethereumjs/evm` instance options
	 * documentation for supported EIPs.
	 */
	common: Common
	/**
	 * A {@link StateManager} instance to use as the state store
	 */
	stateManager: StateManager
	/**
	 * A {@link Blockchain} object for storing/retrieving blocks
	 */
	blockchain: Chain
	evm: EvmType
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
}
