import { loadStateHandler } from '@tevm/actions'

/**
 * A tree-shakeable version of the `tevmLoadState` action for viem.
 * Imports a previously saved blockchain state into TEVM, completely replacing the current state.
 *
 * This function imports a complete blockchain state snapshot that was previously created using 
 * `tevmDumpState`, restoring:
 * 
 * - All account balances, nonces, and storage
 * - Smart contract bytecode
 * - Transaction receipts and history
 * - Block headers and chain history
 * - Current blockchain parameters
 * 
 * When called, this function will:
 * 1. Reset the current blockchain state completely
 * 2. Import all accounts, contracts, and their state from the provided state object
 * 3. Rebuild the blockchain structure with all blocks and transactions
 * 4. Reset the current block pointer and other blockchain parameters
 * 
 * This provides a powerful mechanism for:
 * - Creating pre-defined test environments
 * - Implementing "save points" in applications
 * - Sharing reproducible blockchain states between systems
 * - Restoring state across application sessions
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @param {import('@tevm/actions').LoadStateParams} params - The serialized state object previously generated by tevmDumpState.
 * @returns {Promise<import('@tevm/actions').LoadStateResult>} An object indicating the success or failure of the state loading operation.
 *
 * @example
 * ```typescript
 * import { tevmLoadState } from 'tevm/actions'
 * import { createClient, http } from 'viem'
 * import { optimism } from 'tevm/common'
 * import { createTevmTransport } from 'tevm'
 * import fs from 'fs/promises'
 *
 * const client = createClient({
 *   transport: createTevmTransport(),
 *   chain: optimism,
 * })
 *
 * async function loadSavedState() {
 *   try {
 *     // Read the serialized state from file
 *     const serializedState = await fs.readFile('blockchain-snapshot.json', 'utf8')
 *     
 *     // Parse the state, handling BigInt values
 *     const state = JSON.parse(serializedState, (_, value) => {
 *       // Convert string representations of BigInt back to actual BigInt
 *       if (typeof value === 'string' && /^\d+n$/.test(value)) {
 *         return BigInt(value.slice(0, -1))
 *       }
 *       return value
 *     })
 *     
 *     // Load the state into TEVM
 *     await tevmLoadState(client, state)
 *     
 *     // Verify state was loaded by checking chain data
 *     const blockNumber = await client.getBlockNumber()
 *     console.log(`Restored blockchain at block: ${blockNumber}`)
 *     
 *     // Now the client has the exact same state as when tevmDumpState was called
 *     // All accounts, contracts, balances, storage, and history are restored
 *   } catch (error) {
 *     console.error('Failed to load state:', error)
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Creating a test fixture with predefined state
 * import { createMemoryClient } from 'tevm'
 * import predefinedState from './test-fixtures/advanced-defi-setup.json'
 * 
 * async function createTestEnvironment() {
 *   // Start with a clean client
 *   const client = createMemoryClient()
 *   
 *   // Load the predefined test state
 *   await client.tevmLoadState(predefinedState)
 *   
 *   // The client now has a complete test environment with:
 *   // - Predefined accounts with specific balances
 *   // - Deployed contracts at known addresses
 *   // - Contracts with specific storage values
 *   // - Transaction history if needed for testing
 *   
 *   return client
 * }
 * 
 * // In tests:
 * const client = await createTestEnvironment()
 * // Run tests against the predefined environment...
 * ```
 *
 * @see [LoadStateParams](https://tevm.sh/reference/tevm/actions/type-aliases/loadstateparams/) for parameter structure details.
 * @see [LoadStateResult](https://tevm.sh/reference/tevm/actions/type-aliases/loadstateresult/) for return value structure.
 * @see [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 * @see [tevmDumpState](https://tevm.sh/reference/tevm/actions/functions/tevmdumpstate/) for creating serializable state snapshots.
 * @see [SyncStoragePersister](https://tevm.sh/reference/tevm/sync-storage-persister/functions/createsyncpersister/) for automatic state persistence.
 * 
 * @throws {Error} If the provided state object is invalid or incompatible with the current TEVM version.
 */
export const tevmLoadState = async (client, params) => {
	return loadStateHandler(client.transport.tevm)(params)
}
