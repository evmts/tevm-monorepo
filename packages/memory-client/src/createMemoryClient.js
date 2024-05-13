import { createBaseClient } from '@tevm/base-client'
import { eip1993EventEmitter, requestEip1193, tevmActions, tevmSend } from '@tevm/decorators'
import { createClient, createTransport, publicActions, testActions } from 'viem'

// TODO strongly type this! Currently it's return type is inferred

/**
 * A local EVM instance running in JavaScript. Similar to Anvil in your browser
 * @param {import('@tevm/base-client').BaseClientOptions} [options]
 * @example
 * ```ts
 * import { createMemoryClient } from "tevm"
 * import { MyERC721 } from './MyERC721.sol'
 *
 * const tevm = createMemoryClient({
 * 	fork: {
 * 	  url: "https://mainnet.optimism.io",
 * 	},
 * })
 *
 * const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',

 * await tevm.runContractCall(
 *   MyERC721.write.mint({
 *     caller: address,
 *   }),
 * )
 *
 * const balance = await tevm.runContractCall(
 *  MyERC721.read.balanceOf({
 *  caller: address,
 *  }),
 *  )
 *  console.log(balance) // 1n
 *  ```
 */
export const createMemoryClient = (options) => {
	const vmClient = createBaseClient(options)
		.extend(tevmSend())
		.extend(eip1993EventEmitter())
		.extend(requestEip1193())
		.extend(tevmActions())

	const viemClient = createClient({
		type: 'tevm',
		transport: () =>
			createTransport({
				request: /** @type any*/ (vmClient.request),
				type: 'tevm',
				name: /**options?.name ??*/ 'Tevm transport',
				key: /*options?.key ??*/ 'tevm',
				timeout: /*options?.timeout ?? */ 20_000,
				retryCount: /*options?.retryCount ??*/ 3,
				retryDelay: /* options?.retryDelay ?? */ 150,
			}),
	})

	return viemClient
		.extend(testActions({ mode: 'anvil' }))
		.extend(publicActions)
		.extend(() => {
			return {
				_tevm: vmClient,
				tevmReady: vmClient.ready,
				tevmCall: vmClient.call,
				tevmContract: vmClient.contract,
				tevmScript: vmClient.script,
				tevmDeploy: vmClient.deploy,
				tevmMine: vmClient.mine,
				tevmForkUrl: vmClient.forkUrl,
				tevmLoadState: vmClient.loadState,
				tevmDumpState: vmClient.dumpState,
				tevmSetAccount: vmClient.setAccount,
				tevmGetAccount: vmClient.getAccount,
			}
		})
}
