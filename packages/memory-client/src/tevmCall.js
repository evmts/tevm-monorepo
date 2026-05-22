import { callHandler } from '@tevm/actions'

/**
 * Tree-shakeable `tevmCall` action. Low-level EVM call with extra control beyond `eth_call`:
 * impersonation, step tracing, skipBalance, plus `addToMempool` / `addToBlockchain` to turn it
 * into a transaction. For ABI-encoded contract calls use {@link tevmContract}.
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @param {import('@tevm/actions').CallParams} params - Call parameters.
 * @returns {Promise<import('@tevm/actions').CallResult>} Call result including return data, gas, and optional traces.
 *
 * @example
 * ```typescript
 * import { createClient } from 'viem'
 * import { tevmCall } from 'tevm/actions'
 * import { createTevmTransport } from 'tevm'
 *
 * const client = createClient({ transport: createTevmTransport() })
 * const result = await tevmCall(client, { to: '0x123...', data: '0xabc...' })
 * ```
 *
 * @see [CallParams](https://tevm.sh/reference/tevm/actions/type-aliases/callparams/)
 * @see [CallResult](https://tevm.sh/reference/tevm/actions/type-aliases/callresult/)
 * @throws Will throw if the call reverts (error contains revert reason if available).
 */
export const tevmCall = async (client, params) => {
	return callHandler(client.transport.tevm)(params)
}
