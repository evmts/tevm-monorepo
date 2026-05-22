import { tevmActions } from '@tevm/decorators'

/**
 * Viem extension that attaches the full set of TEVM actions to a viem client built with
 * {@link createTevmTransport}. Prefer the tree-shakeable actions directly in frontend bundles.
 *
 * @returns {(client: import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>) => import('./TevmViemActionsApi.js').TevmViemActionsApi} viem extension function.
 * @throws {Error} If the client doesn't have a TEVM transport configured.
 *
 * @example
 * ```typescript
 * import { createClient } from 'viem'
 * import { createTevmTransport, tevmViemActions } from 'tevm'
 *
 * const client = createClient({ transport: createTevmTransport() })
 * const tevmClient = client.extend(tevmViemActions())
 * await tevmClient.tevmReady()
 * ```
 *
 * @see [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 */
export const tevmViemActions = () => {
	/**
	 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client
	 * @returns {import('./TevmViemActionsApi.js').TevmViemActionsApi}
	 * @private
	 */
	const extension = (client) => {
		const { call, contract, deploy, mine, loadState, dumpState, setAccount, getAccount, ready, deal } =
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
		}
	}
	return extension
}
