import type { CallEvents, ContractParams, ContractResult } from '@tevm/actions'
import type { Abi, ContractFunctionName } from '@tevm/utils'
import type { Client } from 'viem'
import type { TevmTransport } from './TevmTransport.js'

/**
 * A type representing the handler for a TEVM contract procedure.
 *
 * This type reuses the viem `contractRead`/`contractWrite` API to encode ABI, function name, and arguments.
 *
 * @template TAbi - The ABI of the contract.
 * @template TFunctionName - The name of the contract function.
 *
 * @param {Client<TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @param {ContractParams<TAbi, TFunctionName>} params - Parameters for the contract method call, including ABI, function name, and arguments.
 * @returns {Promise<ContractResult<TAbi, TFunctionName>>} The result of the contract method call.
 *
 * @example
 * ```typescript
 * import { tevmContract } from 'tevm/actions'
 * import { createClient } from 'viem'
 * import { http } from '@tevm/utils'
 * import { optimism } from 'tevm/common'
 * import { createTevmTransport } from 'tevm'
 *
 * const client = createClient({
 *   transport: createTevmTransport({
 *     fork: { transport: http('https://mainnet.optimism.io')({}) }
 *   }),
 *   chain: optimism,
 * })
 *
 * async function example() {
 *   const res = await tevmContract(client, {
 *     abi: [...],
 *     functionName: 'myFunction',
 *     args: [...],
 *   })
 *   console.log(res)
 * }
 *
 * example()
 * ```
 *
 * @see [ContractParams](https://tevm.sh/reference/tevm/actions/type-aliases/contractparams/) for options reference.
 * @see [ContractResult](https://tevm.sh/reference/tevm/actions/type-aliases/contractresult/) for return values reference.
 * @see [BaseCallParams](https://tevm.sh/reference/tevm/actions/type-aliases/basecallparams-1/) for the base call parameters.
 */
export type TevmContract = <
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends ContractFunctionName<TAbi> = ContractFunctionName<TAbi>,
>(
	client: Client<TevmTransport<string>>,
	params: ContractParams<TAbi, TFunctionName> & CallEvents,
) => Promise<ContractResult<TAbi, TFunctionName>>
