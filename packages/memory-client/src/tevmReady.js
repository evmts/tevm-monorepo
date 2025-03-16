/**
 * A tree-shakeable version of the `tevmReady` action for viem.
 * Waits for TEVM initialization to complete, which is especially important when forking.
 *
 * This function ensures that the TEVM instance is fully initialized and ready for operations.
 * It resolves to `true` when initialization is complete, and throws an error if initialization fails.
 * 
 * The initialization process handles:
 * 
 * - Setting up the EVM execution environment
 * - Initializing blockchain state and storage structures
 * - **For forked instances**: Establishing connection to the remote network and loading initial state
 * - Setting up transaction pool and receipt management systems
 * - Loading any persisted state (when using a persister)
 * - Configuring mining modes and other operational parameters
 *
 * **When to use this function:**
 * 
 * While all TEVM actions implicitly wait for initialization to complete, explicitly calling
 * `tevmReady()` is recommended in these scenarios:
 * 
 * - **Forking environments**: To ensure network connection is established before proceeding
 * - **UI applications**: To show loading indicators during initialization
 * - **Testing**: To separate initialization time from operation time in benchmarks
 * - **Error handling**: To catch initialization failures early with proper error handling
 * - **Complex scripts**: To ensure initialization is complete before proceeding with multiple operations
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @returns {Promise<true>} Resolves to `true` when ready, rejects if initialization fails.
 * @throws {Error} If initialization fails, with details about the specific failure.
 *
 * @example
 * ```typescript
 * import { createMemoryClient, http } from 'tevm'
 * import { optimism } from 'tevm/common'
 *
 * async function main() {
 *   // Create a client that forks from Optimism mainnet
 *   const client = createMemoryClient({
 *     fork: {
 *       transport: http('https://mainnet.optimism.io')({})
 *     },
 *     common: optimism,
 *   })
 *
 *   try {
 *     // Show loading indicator in UI
 *     showLoadingIndicator('Connecting to Optimism...')
 *     
 *     // Wait for fork to initialize
 *     await client.tevmReady()
 *     
 *     // Hide loading indicator
 *     hideLoadingIndicator()
 *     
 *     // Now it's safe to interact with the forked network
 *     const blockNumber = await client.getBlockNumber()
 *     console.log(`Connected to Optimism block ${blockNumber}`)
 *     
 *     // Continue with application logic...
 *   } catch (error) {
 *     // Handle initialization errors gracefully
 *     showErrorMessage(`Failed to connect: ${error.message}`)
 *     console.error('TEVM initialization error:', error)
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Using with promise.race() for timeout handling
 * import { createMemoryClient, http } from 'tevm'
 * 
 * async function initWithTimeout() {
 *   const client = createMemoryClient({
 *     fork: {
 *       transport: http('https://mainnet.ethereum.org')({})
 *     }
 *   })
 *   
 *   // Create a timeout promise
 *   const timeout = new Promise((_, reject) => {
 *     setTimeout(() => reject(new Error('Fork initialization timed out')), 30000)
 *   })
 *   
 *   try {
 *     // Race initialization against timeout
 *     await Promise.race([
 *       client.tevmReady(),
 *       timeout
 *     ])
 *     
 *     console.log('TEVM initialized successfully')
 *     return client
 *   } catch (error) {
 *     console.error('Initialization failed:', error)
 *     throw error
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // For performance benchmarking
 * import { createMemoryClient } from 'tevm'
 * import { optimism } from 'tevm/common'
 *
 * async function benchmark() {
 *   const client = createMemoryClient({
 *     fork: {
 *       transport: http('https://mainnet.optimism.io')({})
 *     },
 *     common: optimism
 *   })
 *
 *   // Measure initialization time separately
 *   console.time('Initialization')
 *   await client.tevmReady()
 *   console.timeEnd('Initialization')
 *
 *   // Now measure operation time separately
 *   console.time('Operations')
 *   for (let i = 0; i < 100; i++) {
 *     await client.getBalance({
 *       address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
 *     })
 *   }
 *   console.timeEnd('Operations')
 * }
 * ```
 *
 * @see [TEVM Actions Guide](https://tevm.sh/learn/actions/) for information about all available actions.
 * @see [Forking Guide](https://tevm.sh/learn/forking/) for details about fork initialization process.
 * @see [createMemoryClient](https://tevm.sh/reference/tevm/memory-client/functions/creatememoryclient/) for client creation options.
 */
export const tevmReady = async (client) => {
	return client.transport.tevm.ready()
}
