import { loadStateHandler } from '@tevm/actions'

/**
 * A tree-shakeable version of the `tevmLoadState` action for viem.
 * Loads a previously dumped state into the TEVM instance, completely replacing the current state.
 *
 * This action allows you to:
 * - Restore a blockchain state that was saved with `tevmDumpState`
 * - Roll back to a previous state snapshot
 * - Initialize a new TEVM instance with a predefined state
 * - Share state between different TEVM instances or processes
 * 
 * When loading state, the entire current state is replaced, including:
 * - All account balances, nonces, and contract code
 * - All contract storage values
 * - Blockchain history and configuration
 * 
 * This is particularly useful for testing, where you can prepare a specific state once
 * and then reuse it across multiple test runs for consistency and performance.
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @param {import('@tevm/actions').LoadStateParams} params - The state object previously obtained from tevmDumpState.
 * @returns {Promise<import('@tevm/actions').LoadStateResult>} The result of loading the state.
 *
 * @example
 * ```typescript
 * import { tevmLoadState, tevmDumpState } from 'tevm/actions'
 * import { createClient, http, parseEther } from 'viem'
 * import { optimism } from 'tevm/common'
 * import { createTevmTransport } from 'tevm'
 * import fs from 'fs/promises'
 *
 * async function main() {
 *   // Create a client and set up some initial state
 *   const client = createClient({
 *     transport: createTevmTransport({
 *       fork: { transport: http('https://mainnet.optimism.io')({}) }
 *     }),
 *     chain: optimism,
 *   })
 *
 *   // Create a test account with some ETH
 *   await client.setBalance({
 *     address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
 *     value: parseEther('1000')
 *   })
 *
 *   // Save this baseline state for future use
 *   const baselineState = await tevmDumpState(client)
 *   await fs.writeFile('baseline-state.json', JSON.stringify(baselineState))
 *   
 *   // Later, start with a fresh client
 *   const newClient = createClient({
 *     transport: createTevmTransport(),
 *     chain: optimism,
 *   })
 *   
 *   // Load the saved state
 *   const savedState = JSON.parse(await fs.readFile('baseline-state.json', 'utf8'))
 *   await tevmLoadState(newClient, savedState)
 *   
 *   // Verify the state was restored
 *   const balance = await newClient.getBalance({
 *     address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
 *   })
 *   console.log('Restored balance:', balance) // Should be 1000 ETH
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Using for test snapshots and state rollback
 * import { createMemoryClient } from 'tevm'
 * import { ERC20 } from './ERC20.sol'
 * 
 * async function testTokenTransfers() {
 *   const client = createMemoryClient()
 *   
 *   // Set up token contract
 *   const token = await client.deployContract(ERC20)
 *   await client.mine()
 *   
 *   // Set up two test accounts
 *   const alice = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
 *   const bob = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
 *   
 *   // Mint tokens to Alice
 *   await token.write.mint(alice, 1000n)
 *   await client.mine()
 *   
 *   // Save state after setup but before test actions
 *   const setupState = await client.tevmDumpState()
 *   
 *   // Test 1: Transfer tokens
 *   await token.write.transfer(bob, 100n, {from: alice})
 *   await client.mine()
 *   
 *   const aliceBalance1 = await token.read.balanceOf(alice)
 *   const bobBalance1 = await token.read.balanceOf(bob)
 *   console.log('Test 1 - Alice:', aliceBalance1, 'Bob:', bobBalance1)
 *   
 *   // Restore to initial state to run a different test
 *   await client.tevmLoadState(setupState)
 *   
 *   // Test 2: Different transfer amount
 *   await token.write.transfer(bob, 200n, {from: alice})
 *   await client.mine()
 *   
 *   const aliceBalance2 = await token.read.balanceOf(alice)
 *   const bobBalance2 = await token.read.balanceOf(bob)
 *   console.log('Test 2 - Alice:', aliceBalance2, 'Bob:', bobBalance2)
 * }
 * ```
 * 
 * @throws Will throw if the state object format is invalid or incompatible.
 * @throws Will throw if the state object contains corrupted or invalid data.
 *
 * @see [LoadStateParams](https://tevm.sh/reference/tevm/actions/type-aliases/loadstateparams/) for options reference.
 * @see [LoadStateResult](https://tevm.sh/reference/tevm/actions/type-aliases/loadstateresult/) for return values reference.
 * @see [tevmDumpState](https://tevm.sh/reference/tevm/actions/functions/tevmdumpstate/) for saving the state.
 * @see [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 */
export const tevmLoadState = async (client, params) => {
	return loadStateHandler(client.transport.tevm)(params)
}
