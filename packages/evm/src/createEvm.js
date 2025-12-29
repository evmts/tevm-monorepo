import { createLogger } from '@tevm/logger'
import { Evm } from './Evm.js'

/**
 * Creates the Tevm Evm to execute ethereum bytecode internally.
 * Wraps [ethereumjs EVM](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm)
 * @example
 * ```typescript
 * import { createEvm } from '@tevm/evm'
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
 * const runCallResult = await evm.runCall({
 *   to: EthjsAddress.from(`0x${'00'.repeat(20)}`),
 *   value: 420n,
 *   skipBalance: true,
 * })
 * console.log(runCallResult)
 * ````
 * @param {import('./CreateEvmOptions.js').CreateEvmOptions} options
 * @returns {Promise<import('./EvmType.js').Evm>} A tevm Evm instance with tevm specific defaults
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
	const logger = createLogger({
		name: '@tevm/evm',
		level: loggingLevel ?? 'warn',
	})
	logger.debug({
		allowUnlimitedContractSize,
		profiler,
		customPrecompiles: customPrecompiles?.map((c) => c.address.toString()),
	})
	const evm = await Evm.create({
		common,
		stateManager,
		blockchain,
		allowUnlimitedContractSize: allowUnlimitedContractSize ?? false,
		profiler: profiler ?? false,
		loggingLevel: loggingLevel ?? 'warn',
	})
	return evm
}
