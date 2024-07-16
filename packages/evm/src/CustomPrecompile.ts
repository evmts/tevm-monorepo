import type { Evm } from './EvmType.js'
/**
 * TODO This should be publically exported from ethereumjs but isn't
 * Typing this by hand is tedious so we are using some typescript inference to get it
 * do a pr to export this from ethereumjs and then replace this with an import
 * TODO this should be modified to take a hex address rather than an ethjs address to be consistent with rest of Tevm
 */
/**
 * Custom precompiles allow you to run arbitrary JavaScript code in the EVM
 * @example
 * ```typescript
 * import { createMemoryClient } from 'tevm'
 * import { type CustomPrecompile } from 'tevm/evm'
 * import { definePrecompile, defineCall } from 'tevm'
 * import { createContract } from 'tevm/contract'
 *
 * const precompileContract = createContract({
 *   name: 'Precompile',
 *   humanReadableAbi: [
 *     'function cwd(string) returns (string)',
 *   ],
 * })
 * const customPrecompiles: CustomPrecompile = definePrecompile({
 *   contract: precompileContract,
 *   call: defineCall(precompileContract.abi, {
 *     cwd: async ({ args }) => {
 *       return {
 *         returnValue: process.cwd(),
 *         executionGasUsed: 0n,
 *       }
 *     },
 *   }),
 * })
 *
 * const memoryClient = createMemoryClient({ customPrecompiles: [customPrecompiles] })
 * ```
 * @see [Scripting guide](https://tevm.sh/learn/scripting/)
 * @see [definePrecompile](https://tevm.sh/reference/tevm/precompiles/functions/defineprecompile/)
 * @see [MemoryClient](https://tevm.sh/reference/tevm/memory-client/type-aliases/memoryclient/)
 */
export type CustomPrecompile = Exclude<
	Exclude<Parameters<(typeof Evm)['create']>[0], undefined>['customPrecompiles'],
	undefined
>[number]
