import { simulateCallHandler } from '@tevm/actions'

/**
 * A tree-shakeable version of the `tevmSimulateCall` action for viem.
 * Simulates transaction execution at a specific block in the transaction history.
 *
 * It's similar to `debug_traceTransaction` but more flexible as it allows:
 * - Specifying a block and optionally a transaction within that block
 * - Overriding transaction parameters or creating a completely new transaction
 * - Simulating after a specific transaction in a block
 *
 * @example
 * ```typescript
 * import { createClient, http } from 'viem'
 * import { tevmSimulateCall } from 'tevm/memory-client'
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
 *   // Simulate a call on block 12345 after the 2nd transaction
 *   const res = await tevmSimulateCall(client, {
 *     blockNumber: 12345n,
 *     transactionIndex: 1,
 *     to: '0x123...',
 *     data: '0x123...',
 *     skipBalance: true,
 *   })
 *
 *   // Simulate by overriding parameters of an existing transaction
 *   const res2 = await tevmSimulateCall(client, {
 *     blockHash: '0xabc...',
 *     transactionHash: '0x123...',
 *     value: 1000n, // override the value
 *   })
 *
 *   console.log(res)
 * }
 * ```
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @param {import('@tevm/actions').SimulateCallParams} params - Parameters for the simulation, including block reference and transaction parameters.
 * @returns {Promise<import('@tevm/actions').SimulateCallResult>} The result of the simulation.
 *
 * @see [SimulateCallParams](https://tevm.sh/reference/tevm/actions/type-aliases/simulatecallparams/) for options reference.
 * @see [SimulateCallResult](https://tevm.sh/reference/tevm/actions/type-aliases/simulatecallresult/) for return values reference.
 * @see [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 */
export const tevmSimulateCall = async (client, params) => {
	return simulateCallHandler(client.transport.tevm)(params)
}
