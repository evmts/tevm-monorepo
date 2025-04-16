import { callHandler } from '@tevm/actions'

/**
 * A tree-shakeable version of the `tevmCall` action for viem.
 * Executes a low-level call against the Ethereum Virtual Machine (EVM). This function provides enhanced control over the
 * execution environment compared to the standard `eth_call` JSON-RPC method.
 *
 * By default, this is a read-only operation that doesn't modify the blockchain state after execution completes.
 * However, state modifications can be enabled with the following options:
 * - `addToMempool`: Add the transaction to the mempool (must be manually mined later)
 * - `addToBlockchain`: Add the transaction to the mempool AND automatically mine it
 * - `createTransaction`: [DEPRECATED] Use addToMempool instead
 *
 * Important: Tevm defaults to a manual mining mode, which means transactions are not included in the blockchain
 * until you explicitly mine them. Use `addToBlockchain: true` if you want transactions to be immediately mined.
 *
 * The function supports advanced EVM features such as:
 * - Account impersonation (executing as any address without requiring private keys)
 * - Detailed execution tracing with step-by-step opcode inspection
 * - Gas limit and price customization
 * - Balance/nonce checks can be skipped for testing scenarios
 * - Full revert reason messages and traces
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
 *   // Execute a read-only call to a contract
 *   const readResult = await tevmCall(client, {
 *     to: '0x123...',             // Target contract address
 *     data: '0x123...',           // Encoded function call (e.g. from encodeFunctionData)
 *     from: '0x123...',           // Sender address (can be any address when impersonating)
 *     gas: 1000000,               // Gas limit for the call
 *     gasPrice: 1n,               // Gas price in wei
 *     skipBalance: true,          // Skip balance checks (useful for testing)
 *     onStep: (step, next) => {   // Optional: trace EVM execution steps
 *       console.log(`Executing ${step.opcode.name} at PC=${step.pc}`);
 *       next();
 *     }
 *   })
 *
 *   // Submit a transaction to the mempool (requires manual mining)
 *   const txResult = await tevmCall(client, {
 *     to: '0x456...',
 *     data: '0x456...',
 *     value: 1000000000000000000n, // 1 ETH
 *     addToMempool: true,        // Add to mempool but don't mine
 *   })
 *
 *   // Mine the transaction
 *   await client.tevmMine()
 *
 *   // Or submit and mine in one step
 *   const autoMinedResult = await tevmCall(client, {
 *     to: '0x789...',
 *     data: '0x789...',
 *     addToBlockchain: true,      // Add to mempool AND automatically mine
 *   })
 *
 *   console.log(readResult.rawData)       // Return data from the call
 *   console.log(txResult.txHash)          // Transaction hash
 *   console.log(readResult.executionGasUsed) // Actual gas used
 * }
 *
 * example()
 * ```
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @param {import('@tevm/actions').CallParams} params - Parameters for the call, including the target address, call data, sender address, gas limit, gas price, and other options.
 * @returns {Promise<import('@tevm/actions').CallResult>} The result of the call, including execution results, gas used, and any traces.
 *
 * @see [CallParams](https://tevm.sh/reference/tevm/actions/type-aliases/callparams/) for options reference.
 * @see [BaseCallParams](https://tevm.sh/reference/tevm/actions/type-aliases/basecallparams-1/) for the base call parameters.
 * @see [CallResult](https://tevm.sh/reference/tevm/actions/type-aliases/callresult/) for return values reference.
 * @see [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 * @see [tevmContract](https://tevm.sh/reference/tevm/memory-client/functions/tevmcontract/) for a higher-level interface for contract calls
 * @throws Will throw if the call reverts. The error will contain revert reason if available.
 */
export const tevmCall = async (client, params) => {
	return callHandler(client.transport.tevm)(params)
}
