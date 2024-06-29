import { callHandler } from '@tevm/actions'

/**
 * A tree-shakeable version of the `tevmCall` action for viem.
 * Executes a call against the VM. It is similar to `eth_call` but provides more options for controlling the execution environment.
 *
 * By default, it does not modify the state after the call is complete, but this can be configured with the `createTransaction` option.
 *
 * @example
 * ```typescript
 * import { createClient, http } from 'viem'
 * import { tevmCall } from 'tevm/actions'
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
 *   const res = await tevmCall(client, {
 *     to: '0x123...',
 *     data: '0x123...',
 *     from: '0x123...',
 *     gas: 1000000,
 *     gasPrice: 1n,
 *     skipBalance: true,
 *   })
 *   console.log(res)
 * }
 *
 * example()
 * ```
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @param {import('@tevm/actions').CallParams} params - Parameters for the call, including the target address, call data, sender address, gas limit, gas price, and other options.
 * @returns {Promise<import('@tevm/actions').CallResult>} The result of the call.
 *
 * @see [CallParams](https://tevm.sh/reference/tevm/actions/type-aliases/callparams/) for options reference.
 * @see [BaseCallParams](https://tevm.sh/reference/tevm/actions/type-aliases/basecallparams-1/) for the base call parameters.
 * @see [CallResult](https://tevm.sh/reference/tevm/actions/type-aliases/callresult/) for return values reference.
 * @see [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 */
export const tevmCall = async (client, params) => {
	return callHandler(client.transport.tevm)(params)
}
