import type { Abi } from '@tevm/utils'
import type { ContractFunctionName } from '@tevm/utils'
import type { ContractParams } from './ContractParams.js'
import type { ContractResult } from './ContractResult.js'

/**
 * Handler for executing contract interactions with the TEVM.
 *
 * This handler is adapted from viem and is designed to closely match the viem `contractRead`/`contractWrite` API.
 * It encodes the ABI, function name, and arguments to perform the contract call.
 *
 * @param {ContractParams<TAbi, TFunctionName>} action - The parameters for the contract call, including ABI, function name, and arguments.
 * @returns {Promise<ContractResult<TAbi, TFunctionName>>} The result of the contract call, including execution details and any returned data.
 * @throws {TevmCallError} If `throwOnFail` is true, returns `TevmCallError` as value.
 *
 * @example
 * ```typescript
 * import { createBaseClient } from 'tevm/base-client'
 * import { contractHandler } from 'tevm/actions'
 *
 * const client = createBaseClient()
 *
 * const contractCall = contractHandler(client)
 *
 * const res = await contractCall({
 *   abi: [...], // ABI array
 *   functionName: 'myFunction',
 *   args: [arg1, arg2],
 *   to: '0x123...',
 *   from: '0x123...',
 *   gas: 1000000n,
 *   gasPrice: 1n,
 *   skipBalance: true,
 * })
 *
 * console.log(res)
 * ```
 *
 * @see {@link https://tevm.sh/reference/tevm/memory-client/functions/tevmContract | tevmContract}
 * @see {@link ContractParams}
 * @see {@link ContractResult}
 * @template TAbi - The ABI type.
 * @template TFunctionName - The function name type from the ABI.
 */
export type ContractHandler = <
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends ContractFunctionName<TAbi> = ContractFunctionName<TAbi>,
>(
	action: ContractParams<TAbi, TFunctionName>,
) => Promise<ContractResult<TAbi, TFunctionName>>
