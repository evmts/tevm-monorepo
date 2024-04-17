import type { EVM } from '@ethereumjs/evm'

/**
 * @see https://github.com/ethereumjs/ethereumjs-monorepo/pull/3334
 */
export type EVMOpts = Parameters<typeof EVM.create>[0]

