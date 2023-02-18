import { VM } from "@ethereumjs/vm";
import { common } from "./hardFork";

/*
 * VM.create is an async factory function
 *
 */
export const createVm = () =>
	VM.create({
		/**
		 * Use a {@link Common} instance
		 * if you want to change the chain setup.
		 *
		 * ### Possible Values
		 *
		 * - `chain`: all chains supported by `Common` or a custom chain
		 * - `hardfork`: `mainnet` hardforks up to the `Merge` hardfork
		 * - `eips`: `2537` (usage e.g. `eips: [ 2537, ]`)
		 *
		 * Note: check the associated `@ethereumjs/evm` instance options
		 * documentation for supported EIPs.
		 *
		 * ### Default Setup
		 *
		 * Default setup if no `Common` instance is provided:
		 *
		 * - `chain`: `mainnet`
		 * - `hardfork`: `merge`
		 * - `eips`: `[]`
		 */
		common,
		// common?: Common
		/**
		 * A {@link StateManager} instance to use as the state store
		 */
		// stateManager?: StateManager
		/**
		 * A {@link Blockchain} object for storing/retrieving blocks
		 */
		// blockchain?: BlockchainInterface
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
		// activatePrecompiles?: boolean
		/**
		 * If true, the state of the VM will add the genesis state given by {@link Blockchain.genesisState} to a newly
		 * created state manager instance. Note that if stateManager option is also passed as argument
		 * this flag won't have any effect.
		 *
		 * Default: `false`
		 */
		// activateGenesisState?: boolean
		/**
		 * Select hardfork based upon block number. This automatically switches to the right hard fork based upon the block number.
		 *
		 * Default: `false`
		 */
		// hardforkByBlockNumber?: boolean
		/**
		 * Select the HF by total difficulty (Merge HF)
		 *
		 * This option is a superset of `hardforkByBlockNumber` (so only use one of both options)
		 * and determines the HF by both the block number and the TD.
		 *
		 * Since the TD is only a threshold the block number will in doubt take precedence (imagine
		 * e.g. both Merge and Shanghai HF blocks set and the block number from the block provided
		 * pointing to a Shanghai block: this will lead to set the HF as Shanghai and not the Merge).
		 */
		// hardforkByTTD?: BigIntLike
		/**
		 * Use a custom EEI for the EVM. If this is not present, use the default EEI.
		 */
		// eei?: EEIInterface
		/**
		 * Use a custom EVM to run Messages on. If this is not present, use the default EVM.
		 */
		// evm?: EVMInterface
	});
