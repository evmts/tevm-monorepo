import { getAccountHandler } from '@tevm/actions'

/**
 * A tree-shakeable version of the `tevmGetAccount` action for viem.
 * Retrieves detailed account information from the TEVM state.
 *
 * This function provides comprehensive information about an account, including:
 * - Account balance (in wei)
 * - Current nonce
 * - Deployed code (if a contract)
 * - Contract storage (optionally)
 *
 * For normal externally owned accounts (EOAs), it returns basic information like balance and nonce.
 * For contract accounts, it additionally returns the deployed bytecode.
 * 
 * When `returnStorage` is set to `true`, the function also returns contract storage values.
 * Note that in fork mode, it only returns storage that has been accessed and cached in the VM.
 * If storage hasn't been accessed yet, it won't be returned even with `returnStorage: true`.
 * 
 * Be aware that returning storage can be computationally expensive for contracts with large storage,
 * so the default is `false`.
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @param {import('@tevm/actions').GetAccountParams} params - Parameters for retrieving the account information.
 * @returns {Promise<import('@tevm/actions').GetAccountResult>} The account information including balance, nonce, code, and optionally storage.
 *
 * @example
 * ```typescript
 * import { tevmGetAccount } from 'tevm/actions'
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
 *   // Check a standard EOA account
 *   const userAccount = await tevmGetAccount(client, {
 *     address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
 *   })
 *   console.log('User Balance:', userAccount.balance)
 *   console.log('User Nonce:', userAccount.nonce)
 *   
 *   // Check a contract account with storage
 *   const contractAccount = await tevmGetAccount(client, {
 *     address: '0x4200000000000000000000000000000000000042', // Contract address
 *     returnStorage: true,
 *   })
 *   
 *   console.log('Contract Balance:', contractAccount.balance)
 *   console.log('Has Code:', Boolean(contractAccount.deployedBytecode))
 *   console.log('Code Length:', (contractAccount.deployedBytecode?.length || 0) / 2 - 1)
 *   
 *   if (contractAccount.storage) {
 *     console.log('Storage Slots:', Object.keys(contractAccount.storage).length)
 *     // Example of accessing a specific storage slot
 *     const slot0 = contractAccount.storage['0x0000000000000000000000000000000000000000000000000000000000000000']
 *     console.log('Slot 0 Value:', slot0)
 *   }
 * }
 *
 * example()
 * ```
 *
 * @example
 * ```typescript
 * // Using with tevmSetAccount to verify changes
 * import { tevmGetAccount, tevmSetAccount } from 'tevm/actions'
 * import { createMemoryClient } from 'tevm'
 * import { parseEther } from 'viem'
 *
 * async function manageAccounts() {
 *   const client = createMemoryClient()
 *   const testAddress = '0x1234567890123456789012345678901234567890'
 *   
 *   // First check if account exists and initial state
 *   const initialAccount = await tevmGetAccount(client, {
 *     address: testAddress,
 *   })
 *   console.log('Initial state:', initialAccount)
 *   
 *   // Set up the account with specific values
 *   await tevmSetAccount(client, {
 *     address: testAddress,
 *     balance: parseEther('100'),
 *     nonce: 5n,
 *   })
 *   
 *   // Verify the changes were applied
 *   const updatedAccount = await tevmGetAccount(client, {
 *     address: testAddress,
 *   })
 *   
 *   console.log('Updated balance:', updatedAccount.balance) // Should be 100 ETH
 *   console.log('Updated nonce:', updatedAccount.nonce)     // Should be 5n
 * }
 * ```
 * 
 * @throws Will throw if the address is invalid.
 *
 * @see [GetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountparams/) for options reference.
 * @see [GetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountresult/) for return values reference.
 * @see [tevmSetAccount](https://tevm.sh/reference/tevm/actions/functions/tevmsetaccount/) for modifying account state.
 * @see [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 */
export const tevmGetAccount = async (client, params) => {
	return getAccountHandler(client.transport.tevm)(params)
}
