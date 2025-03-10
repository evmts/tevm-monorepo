import { setAccountHandler } from '@tevm/actions'

/**
 * A tree-shakeable version of the `tevmSetAccount` action for viem.
 * Sets or updates an account in TEVM's state.
 *
 * This function allows you to directly manipulate any aspect of an account's state without needing
 * to send transactions. It can be used to:
 * 
 * - Set an EOA's balance and nonce
 * - Deploy a contract directly (without executing constructor code) by setting its bytecode
 * - Set a contract's storage slots to specific values
 * - Create a complete test environment with multiple accounts and contracts
 *
 * This is especially useful for:
 * - Setting up complex test environments with pre-defined state
 * - Testing edge cases that would be difficult to set up with transactions
 * - Directly inserting contract bytecode without going through deployment
 * - Creating test accounts with specific balances
 *
 * @param {import('viem').Client<import('./MemoryClient.js').TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @param {import('@tevm/actions').SetAccountParams} params - Parameters for setting the account.
 * @returns {Promise<import('@tevm/actions').SetAccountResult>} The result of setting the account.
 *
 * @example
 * ```typescript
 * import { tevmSetAccount } from 'tevm/actions'
 * import { createClient, http, parseEther } from 'viem'
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
 *   // Create an EOA with 100 ETH
 *   await tevmSetAccount(client, {
 *     address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
 *     balance: parseEther('100'),
 *     nonce: 0n,
 *   })
 *   
 *   // Verify the balance was set
 *   const balance = await client.getBalance({
 *     address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
 *   })
 *   console.log('Account balance:', balance) // 100000000000000000000n
 * }
 *
 * example()
 * ```
 *
 * @example
 * ```typescript
 * // Deploy a contract directly (without executing constructor code)
 * import { tevmSetAccount } from 'tevm/actions'
 * import { createMemoryClient } from 'tevm'
 * import { numberToHex } from 'viem'
 * import { SimpleStorage } from './SimpleStorage.sol'
 *
 * const client = createMemoryClient()
 *
 * async function example() {
 *   // Set up a contract at a specific address with initial storage
 *   const contractAddress = '0x0000000000000000000000000000000000000123'
 *   
 *   await tevmSetAccount(client, {
 *     address: contractAddress,
 *     // Deploy the contract bytecode directly
 *     deployedBytecode: SimpleStorage.deployedBytecode,
 *     // Initialize storage slots (optional)
 *     state: {
 *       // Set the value at storage slot 0 to 42
 *       [`0x${'0'.repeat(64)}`]: numberToHex(42n),
 *     },
 *   })
 *   
 *   // Create a contract instance at this address
 *   const contract = SimpleStorage.withAddress(contractAddress)
 *   
 *   // Read from the contract to verify the storage was set
 *   const value = await contract.read.get()
 *   console.log('Contract value:', value) // Should be 42n
 * }
 *
 * example()
 * ```
 *
 * @throws Will throw if the address is invalid.
 * @throws Will throw if the deployedBytecode is invalid hex.
 * @throws Will throw if any storage slot key or value is invalid hex.
 *
 * @see [SetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountparams/) for options reference.
 * @see [SetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountresult/) for return values reference.
 * @see [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 * @see [tevmDeploy](https://tevm.sh/reference/tevm/actions/functions/tevmdeploy/) for deploying contracts via transactions.
 */
export const tevmSetAccount = async (client, params) => {
	return setAccountHandler(client.transport.tevm)(params)
}
