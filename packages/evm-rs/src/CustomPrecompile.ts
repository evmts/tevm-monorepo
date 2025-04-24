import type { Evm } from './EvmType.js'

/**
 * Custom precompiles allow you to run arbitrary JavaScript code in the EVM
 */
export type CustomPrecompile = Exclude<
	Exclude<Parameters<(typeof Evm)['create']>[0], undefined>['customPrecompiles'],
	undefined
>[number]
