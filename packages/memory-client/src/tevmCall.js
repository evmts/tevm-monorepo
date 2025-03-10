import { callHandler } from '@tevm/actions'

/**
 * A tree-shakeable version of the `tevmCall` action for direct EVM execution.
 *
 * This function provides low-level access to execute calls against the Ethereum Virtual Machine.
 * It is similar to the standard `eth_call` JSON-RPC method but offers significantly more control
 * over the execution environment and returns more detailed results, including:
 *
 * - Detailed execution results and gas usage information
 * - Optional execution traces for debugging
 * - Access lists for gas optimization
 * - Ability to create actual transactions that modify state
 * - Support for event handlers that monitor execution
 *
 * By default, it performs a read-only call that doesn't modify state. To create a transaction
 * that updates state, set the `createTransaction` option to true. Note that you'll need to mine
 * the transaction manually or use auto-mining for state changes to take effect.
 *
 * For easier interaction with contracts, consider using `tevmContract` which handles ABI encoding/decoding
 * and provides a more convenient interface similar to viem's `readContract`/`writeContract`.
 *
 * @example
 * ```typescript
 * import { createClient, http, parseEther, encodeFunctionData, parseAbi } from 'viem'
 * import { tevmCall } from 'tevm/actions'
 * import { optimism } from 'tevm/common'
 * import { createTevmTransport } from 'tevm'
 *
 * const client = createClient({
 *   transport: createTevmTransport({
 *     fork: {
 *       transport: http('https://mainnet.optimism.io')({})
 *     },
 *     mining: { mode: 'auto' } // Auto-mine transactions
 *   }),
 *   chain: optimism,
 * })
 *
 * async function example() {
 *   // Example 1: Basic read-only call to a contract
 *   // This is equivalent to balanceOf(vitalik.eth) on USDC contract
 *   const abi = parseAbi(['function balanceOf(address owner) view returns (uint256)'])
 *   const data = encodeFunctionData({
 *     abi,
 *     functionName: 'balanceOf',
 *     args: ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
 *   })
 *
 *   const readResult = await tevmCall(client, {
 *     to: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC contract
 *     data,
 *   })
 *   console.log('Call succeeded:', readResult.executionResult.exceptionError === undefined)
 *   console.log('Raw data:', readResult.rawData)
 *   console.log('Gas used:', readResult.executionResult.gasUsed)
 *
 *   // Example 2: Call with tracing enabled for debugging
 *   const traceResult = await tevmCall(client, {
 *     to: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
 *     data,
 *     createTrace: true,
 *     createAccessList: true
 *   })
 *
 *   if (traceResult.trace) {
 *     // Examine each step in the execution trace
 *     for (const step of traceResult.trace) {
 *       console.log(`${step.pc}: ${step.opcode.name} Gas: ${step.gasLeft}`)
 *     }
 *   }
 *
 *   if (traceResult.accessList) {
 *     // Access list shows which storage slots and addresses were accessed
 *     console.log('Access list:', traceResult.accessList)
 *   }
 *
 *   // Example 3: State-modifying transaction (transfer ETH)
 *   const txResult = await tevmCall(client, {
 *     to: '0x1234567890123456789012345678901234567890',
 *     value: parseEther('1.0'),
 *     from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
 *     createTransaction: true
 *   })
 *   console.log('Transaction hash:', txResult.txHash)
 *
 *   // In manual mining mode, you would need to mine to apply changes
 *   // await client.mine()
 *
 *   // Example 4: Using event handlers to monitor execution
 *   let stepCount = 0
 *   const debugResult = await tevmCall(client, {
 *     to: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
 *     data,
 *     onStep: (step, next) => {
 *       stepCount++
 *       // Inspect stack, memory, or other execution state
 *       console.log(`Executing ${step.opcode.name} at PC=${step.pc}`)
 *       next() // Must call next() to continue execution
 *     }
 *   })
 *   console.log(`Execution completed in ${stepCount} steps`)
 *
 *   // Example 5: Skip balance check for testing scenarios
 *   const skipBalanceResult = await tevmCall(client, {
 *     to: '0x1234567890123456789012345678901234567890',
 *     value: parseEther('1000000.0'), // Very large amount that would normally fail
 *     from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
 *     skipBalance: true, // Ignores if sender has insufficient balance
 *   })
 *   console.log('Call succeeded despite insufficient balance')
 * }
 *
 * example()
 * ```
 *
 * @param {import('viem').Client<import('./MemoryClient.js').TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @param {object} params - Parameters for the call
 * @param {string} [params.to] - Target address (required for calls, optional for deployments)
 * @param {string} [params.data] - Call data (function selector and encoded parameters)
 * @param {string} [params.from] - Address to use as the sender
 * @param {bigint} [params.value] - Amount of ETH to send with the call
 * @param {bigint} [params.gas] - Gas limit for execution
 * @param {boolean} [params.createTransaction=false] - Whether to create an actual transaction
 * @param {boolean} [params.createTrace=false] - Whether to generate a trace of the execution
 * @param {boolean} [params.createAccessList=false] - Whether to generate an EIP-2930 access list
 * @param {boolean} [params.skipBalance=false] - Whether to skip balance checks (useful for testing)
 * @param {Function} [params.onStep] - Event handler for each EVM execution step
 * @returns {Promise<import('@tevm/actions').CallResult>} The detailed result of the call
 * @throws {import('@tevm/actions').TevmCallError} When the call execution fails
 * @throws Will throw if the to address is invalid.
 * @throws Will throw if the from address is invalid.
 * @throws Will throw if the call data is invalid hex.
 * @throws Will throw if the call reverts (unless errors are being caught in the result).
 *
 * @see [CallParams](https://tevm.sh/reference/tevm/actions/type-aliases/callparams/) - Complete options reference
 * @see [CallResult](https://tevm.sh/reference/tevm/actions/type-aliases/callresult/) - Return values reference
 * @see [tevmContract](https://tevm.sh/reference/tevm/actions/functions/tevmcontract/) - Higher-level version for contract interaction
 * @see [TEVM Actions Guide](https://tevm.sh/learn/actions/) - Complete actions documentation
 */
export const tevmCall = async (client, params) => {
	return callHandler(client.transport.tevm)(params)
}
