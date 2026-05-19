import type { EVMOpts } from '@evmts/zevm/evm'

/**
 * Custom precompiles allow you to run arbitrary JavaScript code in the EVM
 */
export type CustomPrecompile = Exclude<NonNullable<EVMOpts['customPrecompiles']>, undefined>[number]
