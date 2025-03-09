import { contractHandler } from '@tevm/actions'

/**
 * A tree-shakeable version of the `tevmContract` action for viem.
 * Interacts with a contract method call using TEVM.
 *
 * Internally, `tevmContract` wraps `tevmCall`. It automatically encodes and decodes the contract call parameters and results, as well as any revert messages.
 *
 * @type {import('./TevmContractType.js').TevmContract}
 * @example
 * ```typescript
 * import { tevmContract } from 'tevm/actions'
 * import { createClient, http } from 'viem'
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
 * @see [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 */
export const tevmContract = async (client, params) => {
	// TODO this shouldn't need to be any any
	return contractHandler(client.transport.tevm)(/** @type {any}*/(params))
}
