import { createLogger } from '@tevm/logger'
import { createAddressFromString, hexToBytes } from '@tevm/utils'
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
	customPredeploys,
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
		customPredeploys: customPredeploys?.map((p) => p.contract.address),
	})
	for (const predeploy of customPredeploys ?? []) {
		await stateManager.putCode(createAddressFromString(predeploy.contract.address), hexToBytes(predeploy.contract.deployedBytecode))
	}
	const evm = await Evm.create({
		common: common.ethjsCommon,
		stateManager: /** @type {NonNullable<import('@evmts/zevm/evm').EVMOpts['stateManager']>} */ (
			/** @type {unknown} */ (stateManager)
		),
		blockchain,
		allowUnlimitedContractSize: allowUnlimitedContractSize ?? false,
		allowUnlimitedInitCodeSize: false,
		customOpcodes: [],
		// TODO uncomment the mapping once we make the api correct
		// Edit: nvm not letting this block a stable release maybe update it next major
		// @warning Always pass in an empty array if no precompiles as `addPrecompile` method assumes it's there
		customPrecompiles: [...(customPrecompiles ?? [])],
		profiler: {
			enabled: profiler ?? false,
		},
	})
	if (loggingLevel === 'trace') {
		evm.events?.on('step', (step) => {
			logger.trace(
				{
					pc: step.pc,
					op: step.opcode.name,
					gas: step.gasLeft.toString(),
					gasCost: step.opcode.dynamicFee.toString(),
					depth: step.depth,
				},
				'EVM step',
			)
		})
	}
	evm.addCustomPrecompile = evm.addCustomPrecompile?.bind(evm) ?? Evm.prototype.addCustomPrecompile.bind(evm)
	evm.removeCustomPrecompile = evm.removeCustomPrecompile?.bind(evm) ?? Evm.prototype.removeCustomPrecompile.bind(evm)
	return evm
}
