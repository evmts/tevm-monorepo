import { dumpStateHandler } from '@tevm/actions'

/**
 * A tree-shakeable version of the `tevmDumpState` action for viem.
 * Dumps the current state of the TEVM instance into a serializable JavaScript object that can be
 * persisted and later restored using the `tevmLoadState` action.
 *
 * The dumped state includes:
 * - All account balances, nonces, and contract code
 * - All storage values across all contracts
 * - Current blockchain state (block number, transactions, etc.)
 * - VM configuration
 *
 * This action is particularly useful for:
 * - Persisting the state between application sessions
 * - Creating snapshots before performing operations that you may want to roll back
 * - Sharing blockchain environments across processes or with other developers
 * - Testing scenarios that require a specific blockchain state
 * - Creating reproducible test environments
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @returns {Promise<import('@tevm/actions').DumpStateResult>} A serializable object representing the entire TEVM state.
 *
 * @example
 * ```typescript
 * import { tevmDumpState, tevmLoadState } from 'tevm/actions'
 * import { createClient, http, parseEther } from 'viem'
 * import { optimism } from 'tevm/common'
 * import { createTevmTransport } from 'tevm'
 * import fs from 'fs/promises'
 *
 * const client = createClient({
 *   transport: createTevmTransport({
 *     fork: { transport: http('https://mainnet.optimism.io')({}) }
 *   }),
 *   chain: optimism,
 * })
 *
 * async function saveState() {
 *   // Set up some state to save
 *   await client.setBalance({
 *     address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
 *     value: parseEther('100')
 *   })
 *   
 *   // Send some transactions
 *   await client.sendTransaction({
 *     from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
 *     to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
 *     value: parseEther('10')
 *   })
 *   
 *   // Mine the transactions to update state
 *   await client.mine()
 *
 *   // Dump and save the current state
 *   const state = await tevmDumpState(client)
 *   await fs.writeFile('tevm-state.json', JSON.stringify(state, null, 2))
 *   console.log('State saved to tevm-state.json')
 *   
 *   return state
 * }
 *
 * async function restoreState() {
 *   // Create a fresh client
 *   const newClient = createClient({
 *     transport: createTevmTransport(),
 *     chain: optimism,
 *   })
 *   
 *   // Load state from file
 *   const stateJson = await fs.readFile('tevm-state.json', 'utf8')
 *   const state = JSON.parse(stateJson)
 *   
 *   // Restore the state
 *   await tevmLoadState(newClient, state)
 *   console.log('State restored from tevm-state.json')
 *   
 *   // Verify state was restored correctly
 *   const balance = await newClient.getBalance({
 *     address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
 *   })
 *   console.log('Restored account balance:', balance) // Should be 90 ETH
 * }
 *
 * // Usage
 * async function main() {
 *   await saveState()
 *   await restoreState()
 * }
 *
 * main()
 * ```
 *
 * @example
 * ```typescript
 * // Using state snapshots for test isolation
 * import { createMemoryClient } from 'tevm'
 * import { SimpleStorage } from './SimpleStorage.sol'
 *
 * async function testExample() {
 *   const client = createMemoryClient()
 *   
 *   // Set up initial test state
 *   const contract = await client.deployContract(SimpleStorage)
 *   await client.mine()
 *   
 *   // Save a snapshot of the initial state
 *   const initialState = await client.tevmDumpState()
 *   
 *   // Run test 1 with modifications to state
 *   await contract.write.set(42n)
 *   await client.mine()
 *   const value1 = await contract.read.get()
 *   console.log('Test 1 result:', value1) // 42n
 *   
 *   // Restore initial state for next test
 *   await client.tevmLoadState(initialState)
 *   
 *   // Run test 2 with a clean state
 *   await contract.write.set(99n)
 *   await client.mine()
 *   const value2 = await contract.read.get()
 *   console.log('Test 2 result:', value2) // 99n
 * }
 * ```
 *
 * @see [DumpStateResult](https://tevm.sh/reference/tevm/actions/type-aliases/dumpstateresult/) for return values reference.
 * @see [tevmLoadState](https://tevm.sh/reference/tevm/actions/functions/tevmloadstate/) for restoring the state.
 * @see [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 */
export const tevmDumpState = async (client) => {
	return dumpStateHandler(client.transport.tevm)()
}
