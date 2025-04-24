import { Evm } from './Evm.js'

/**
 * Creates the Tevm Evm to execute ethereum bytecode internally.
 * This implementation uses REVM via WebAssembly under the hood.
 *
 * @param {import('./CreateEvmOptions.js').CreateEvmOptions} options
 * @returns {Promise<import('./EvmType.js').Evm>} A tevm Evm instance with tevm specific defaults
 *
 * @example
 * ```typescript
 * import { createEvm } from '@tevm/evm-rs'
 * import { mainnet } from '@tevm/common'
 * import { createBlockchain } from '@tevm/blockchain'
 * import { createStateManager } from '@tevm/state-manager'
 * import { EthjsAddress } from '@tevm/utils'
 *
 * const common = mainnet.clone()
 * const stateManager = createStateManager({ common })
 * const blockchain = createBlockchain({ common })
 * const evm = await createEvm({ common, stateManager, blockchain})
 *
 * // Make sure to wait for the EVM to be ready
 * await evm.ready()
 *
 * const runCallResult = await evm.runCall({
 *   to: EthjsAddress.from(`0x${'00'.repeat(20)}`),
 *   value: 420n,
 *   skipBalance: true,
 * })
 * console.log(runCallResult)
 * ````
 */
export const createEvm = async ({
	common,
	stateManager,
	blockchain,
	customPrecompiles,
	profiler,
	allowUnlimitedContractSize,
	loggingLevel,
}) => {
	// Create EVM instance
	const evm = await Evm.create({
		common,
		stateManager,
		blockchain,
		customPrecompiles,
		profiler,
		allowUnlimitedContractSize,
		loggingLevel,
	})

	// The ready promise is already awaited inside Evm.create(),
	// so the instance is ready to use when returned
	return evm
}
