import { tevmActions } from '@tevm/decorators'

export const tevmViemActions = () => {
	/**
	 * A viem extension that adds tevm actions to a viem client.
	 * The the viem client must already have tevm suport via `createTevmClient` or `createTevmTransport`
	 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client
	 * @returns {import('./TevmViemActionsApi.js').TevmViemActionsApi} }
	 */
	const extension = (client) => {
		const { call, contract, script, deploy, mine, loadState, dumpState, setAccount, getAccount, ready } =
			client.transport.tevm.extend(tevmActions())
		return {
			tevm: client.transport.tevm,
			tevmReady: ready,
			tevmCall: call,
			tevmContract: contract,
			tevmScript: script,
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
