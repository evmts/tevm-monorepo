import type { Contract } from '@tevm/contract'
import type { ExecResult } from '@tevm/evm'
import type { Address, Hex } from '@tevm/utils'
import { Precompile } from './Precompile.js'

/**
 * Defines a precompile contract that executes JavaScript code instead of EVM bytecode.
 *
 * A precompile is a special kind of contract that is deployed at a specific address
 * but executes JavaScript code rather than EVM bytecode. This allows for implementing
 * functionality that would be difficult or inefficient to implement in Solidity.
 *
 * @example
 * ```js
 * import { defineCall, definePrecompile } from '@tevm/precompiles'
 * import { Contract } from '@tevm/contract'
 * import { parseAbi } from '@tevm/utils'
 *
 * // Define a contract interface
 * const fsAbi = parseAbi([
 *   'function readFile(string path) view returns (string)',
 *   'function writeFile(string path, string content) returns (bool)'
 * ])
 *
 * const FsContract = {
 *   abi: fsAbi,
 *   address: '0xf2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2'
 * } as const
 *
 * // Create precompile with handlers
 * const fsPrecompile = definePrecompile({
 *   contract: FsContract,
 *   call: defineCall(fsAbi, {
 *     readFile: async ({ args }) => {
 *       return {
 *         returnValue: await fs.readFile(args[0], 'utf8'),
 *         executionGasUsed: 0n
 *       }
 *     },
 *     writeFile: async ({ args }) => {
 *       await fs.writeFile(args[0], args[1])
 *       return {
 *         returnValue: true,
 *         executionGasUsed: 0n
 *       }
 *     }
 *   })
 * })
 * ```
 */
export const definePrecompile = <
	TContract extends Contract<any, any, Address, any, any, any> = Contract<
		string,
		ReadonlyArray<string>,
		Address,
		any,
		any,
		any
	>,
>({
	contract,
	call,
}: {
	contract: TContract
	call: (context: {
		data: Hex
		gasLimit: bigint
	}) => Promise<ExecResult>
}): Precompile<TContract> => {
	return new Precompile(contract, call)
}
