import type { EVMOpts } from '@evmts/zevm/evm'

export type CustomPrecompile = Exclude<NonNullable<EVMOpts['customPrecompiles']>, undefined>[number]
