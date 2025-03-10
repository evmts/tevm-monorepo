/**
 * A tree-shakeable version of the `tevmReady` action for viem.
 * Waits for TEVM to be fully initialized and ready for operations.
 *
 * This function ensures that the TEVM has completed all initialization steps, particularly:
 * - The EVM is initialized
 * - The blockchain state is loaded
 * - If using a fork, the fork connection is established and initial data is loaded
 * - Any predeploys have been set up
 * 
 * It resolves to `true` when TEVM is fully ready for operations, or throws an error if 
 * initialization fails for any reason.
 *
 * Note: All TEVM actions implicitly wait for the VM to be ready, so it's usually not necessary 
 * to explicitly call `tevmReady` before other operations. However, it can be useful in these scenarios:
 * - When you want to ensure initialization completes before timing critical operations
 * - For isolating startup time from operation time in benchmarks
 * - To handle initialization errors separately from operation errors
 * - When using a fork configuration to ensure the fork is ready before operations
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @returns {Promise<true>} Resolves to true when ready, rejects if initialization fails.
 * @throws {Error} If the VM fails to initialize for any reason.
 *
 * @example
 * ```typescript
 * import { tevmReady } from 'tevm/actions'
 * import { createClient, http } from 'viem'
 * import { optimism } from 'tevm/common'
 * import { createTevmTransport } from 'tevm'
 *
 * // Initialize a client with fork configuration
 * const client = createClient({
 *   transport: createTevmTransport({
 *     fork: { 
 *       transport: http('https://mainnet.optimism.io')({})
 *     }
 *   }),
 *   chain: optimism,
 * })
 *
 * async function main() {
 *   console.time('Initialization')
 *   try {
 *     // Wait for the fork to be fully initialized
 *     await tevmReady(client)
 *     console.timeEnd('Initialization')
 *     console.log('TEVM fork is ready')
 *     
 *     // Now perform operations knowing the fork is ready
 *     const blockNumber = await client.getBlockNumber()
 *     console.log(`Forked at block: ${blockNumber}`)
 *     
 *   } catch (error) {
 *     console.error('Failed to initialize TEVM fork:', error)
 *     // Handle the error appropriately, e.g., retry or use a fallback
 *   }
 * }
 *
 * main()
 * ```
 *
 * @example
 * ```typescript
 * // Using with memory client for benchmark timing
 * import { createMemoryClient } from 'tevm'
 * import { parseEther } from 'viem'
 *
 * async function benchmark() {
 *   const client = createMemoryClient({
 *     fork: {
 *       url: 'https://mainnet.optimism.io',
 *     }
 *   })
 *   
 *   // Measure initialization time separately
 *   console.time('Initialization')
 *   await client.tevmReady()
 *   console.timeEnd('Initialization')
 *   
 *   // Now measure operation time
 *   console.time('Operations')
 *   
 *   // Run your benchmark operations
 *   for (let i = 0; i < 100; i++) {
 *     const balance = await client.getBalance({
 *       address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
 *     })
 *   }
 *   
 *   console.timeEnd('Operations')
 * }
 * ```
 *
 * @see [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 * @see [Forking Guide](https://tevm.sh/learn/forking/) for more information about fork initialization.
 */
export const tevmReady = async (client) => {
	return client.transport.tevm.ready()
}
