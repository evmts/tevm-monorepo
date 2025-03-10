import { tevmActions } from '@tevm/decorators'

/**
 * A viem extension that adds TEVM actions to a viem client.
 * The viem client must already have TEVM support via `createTevmClient` or `createTevmTransport`.
 *
 * This extension provides a comprehensive set of actions to interact with the TEVM, including calls, contract interactions, deployments, mining, and more.
 *
 * Note: If you are building a frontend application, you should use the tree-shakable API instead to optimize bundle size.
 * @returns {(client: import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>) => import('./TevmViemActionsApi.js').TevmViemActionsApi} The viem extension to add TevmViemActionsApi
 *
 * @example
 * ```typescript
 * import { createClient, http } from 'viem'
 * import { optimism } from 'tevm/common'
 * import { createTevmTransport, tevmViemActions } from 'tevm'
 *
 * const client = createClient({
 *   transport: createTevmTransport({
 *     fork: { transport: http('https://mainnet.optimism.io')({}) }
 *   }),
 *   chain: optimism,
 * }).extend(tevmViemActions())
 *
 * async function example() {
 *   const account = await client.tevmGetAccount({
 *     address: '0x123...',
 *     returnStorage: true,
 *   })
 *   console.log(account)
 * }
 *
 * example()
 * ```
 *
 * @see [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 * @see [Viem Client Guide](https://viem.sh/docs/clients/)
 */
export const tevmViemActions = () => {
	/**
	 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client - The viem client configured with TEVM transport.
	 * @returns {import('./TevmViemActionsApi.js').TevmViemActionsApi} The extended viem client with TEVM actions.
	 */
	const extension = (client) => {
		const { call, contract, deploy, mine, loadState, dumpState, setAccount, getAccount, ready } =
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
		}
	}
	return extension
}
