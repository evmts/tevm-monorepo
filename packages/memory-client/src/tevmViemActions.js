import { tevmActions } from '@tevm/decorators'

/**
 * A viem extension that adds TEVM actions to a viem client.
 *
 * This function creates a viem extension that adds the full set of TEVM-specific actions to any viem client
 * that has been configured with the TEVM transport. These actions provide direct access to the Ethereum
 * Virtual Machine's capabilities, including:
 *
 * - Low-level EVM execution (`tevmCall`)
 * - Contract interaction with ABI encoding/decoding (`tevmContract`)
 * - Contract deployment (`tevmDeploy`)
 * - Block mining (`tevmMine`)
 * - Account state management (`tevmGetAccount`, `tevmSetAccount`)
 * - State persistence (`tevmDumpState`, `tevmLoadState`)
 * - Token manipulation (`tevmDeal` for ETH and ERC20 tokens)
 * - Direct VM access (`tevm` for advanced usage)
 *
 * The viem client must already have TEVM support via a `createTevmTransport` transport.
 *
 * Note: If you are building a frontend application, you should use the tree-shakable API instead to optimize bundle size.
 *
 * @returns {(client: import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>) => import('./TevmViemActionsApi.js').TevmViemActionsApi} A viem extension function that adds TEVM actions
 * @throws {Error} If the client doesn't have a TEVM transport configured
 *
 * @example
 * ```typescript
 * import { createClient, http } from 'viem'
 * import { optimism } from 'tevm/common'
 * import { createTevmTransport, tevmViemActions } from 'tevm'
 *
 * // Create a basic viem client with TEVM transport
 * const client = createClient({
 *   transport: createTevmTransport({
 *     fork: {
 *       transport: http('https://mainnet.optimism.io')({})
 *     }
 *   }),
 *   chain: optimism,
 * })
 *
 * // Extend the client with TEVM actions
 * const tevmClient = client.extend(tevmViemActions())
 *
 * async function example() {
 *   // Wait for the client to be ready
 *   await tevmClient.tevmReady()
 *
 *   // Set up an account with ETH
 *   await tevmClient.tevmSetAccount({
 *     address: '0x1234567890123456789012345678901234567890',
 *     balance: 1000000000000000000n // 1 ETH
 *   })
 *
 *   // Get account state including storage
 *   const account = await tevmClient.tevmGetAccount({
 *     address: '0x1234567890123456789012345678901234567890',
 *     returnStorage: true,
 *   })
 *   console.log('Account:', account)
 *
 *   // Deploy a contract
 *   const deployResult = await tevmClient.tevmDeploy({
 *     bytecode: '0x608060405234801561001057600080fd5b50610150806100206000396000f3fe...',
 *     abi: [...],
 *     createTransaction: true // Create an actual transaction, not just a call
 *   })
 *
 *   // Mine the transaction to include it in state
 *   await tevmClient.tevmMine()
 *
 *   console.log('Contract deployed at:', deployResult.createdAddress)
 * }
 *
 * example()
 * ```
 *
 * @see [TEVM Actions Guide](https://tevm.sh/learn/actions/) - Complete documentation of all TEVM actions
 * @see [Viem Client Guide](https://viem.sh/docs/clients/) - Viem client documentation
 * @see {@link TevmViemActionsApi} - The API interface this extension implements
 */
export const tevmViemActions = () => {
	/**
	 * Internal extension function that adds TEVM actions to a viem client.
	 *
	 * This function extracts the TEVM API methods from the client's transport and
	 * exposes them with the prefix 'tevm' to make them available on the client object.
	 *
	 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client - The viem client configured with TEVM transport.
	 * @returns {import('./TevmViemActionsApi.js').TevmViemActionsApi} The TEVM actions API interface with all methods.
	 * @throws {TypeError} If the client doesn't have a TEVM transport configured.
	 * @private
	 */
	const extension = (client) => {
		const { call, contract, deploy, mine, loadState, dumpState, setAccount, getAccount, ready, deal, simulateCall } =
			client.transport.tevm.extend(tevmActions())
		return {
			tevmReady: ready,
			tevmCall: call,
			tevmContract: contract,
			tevmDeploy: deploy,
			tevmMine: mine,
			tevmLoadState: loadState,
			tevmDumpState: dumpState,
			tevmSetAccount: setAccount,
			tevmGetAccount: getAccount,
			tevmDeal: deal,
			tevmSimulateCall: simulateCall,
		}
	}
	return extension
}
