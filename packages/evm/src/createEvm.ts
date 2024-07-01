import { createLogger } from '@tevm/logger'
import type { CreateEvmOptions } from './CreateEvmOptions.js'
import { Evm } from './Evm.js'

/**
 * Creates the Tevm Evm to execute ethereum bytecode
 * Wraps [ethereumjs EVM](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm)
 * @returns A tevm Evm instance with tevm specific defaults
 * ```typescript
 * import { type Evm, createEvm, CreateEvmOptions } from 'tevm/evm'
 * import { mainnet } from 'tevm/common'
 * import { createStateManager } from 'tevm/state'
 * import { createBlockchain } from 'tevm/blockchain'}
 * import { EthjsAddress } from 'tevm/utils'
 *
 * const evm: Evm = createEvm({
 *   common: mainnet.copy(),
 *   stateManager: createStateManager(),
 *   blockchain: createBlockchain(),
 * })
 *
 * const result = await evm.runCall({
 *   to: EthjsAddress.fromString(`0x${'0'.repeat(40)}`),
 *   value: 420n,
 *   skipBalance: true,
 * })
 *
 * console.log(result)
 * ```
 */
export const createEvm = async ({
	common,
	stateManager,
	blockchain,
	customPrecompiles,
	profiler,
	allowUnlimitedContractSize,
	loggingLevel,
}: CreateEvmOptions): Promise<Evm> => {
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
		common: common.ethjsCommon,
		stateManager,
		blockchain,
		allowUnlimitedContractSize: allowUnlimitedContractSize ?? false,
		allowUnlimitedInitCodeSize: false,
		customOpcodes: [],
		// TODO uncomment the mapping once we make the api correct
		// Edit: nvm not letting this block a stable release maybe update it next major
		// @warning Always pass in an empty array if no precompiles as `addPrecompile` method assumes it's there
		customPrecompiles: customPrecompiles ?? [],
		profiler: {
			enabled: profiler ?? false,
		},
	})
	if (loggingLevel === 'trace') {
		// we are hacking ethereumjs logger into working with our logger
		const evmAny = evm as any
		evmAny.DEBUG = true
		evmAny._debug = logger
	}
	evm.addCustomPrecompile = evm.addCustomPrecompile?.bind(evm) ?? Evm.prototype.addCustomPrecompile.bind(evm)
	evm.removeCustomPrecompile = evm.removeCustomPrecompile?.bind(evm) ?? Evm.prototype.removeCustomPrecompile.bind(evm)
	return evm
}
