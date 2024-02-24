import { createBaseClient } from '@tevm/base-client'
import {
	createEip1993EventEmitter,
	ethActions,
	requestEip1193,
	tevmActions,
	tevmSend,
} from '@tevm/decorators'

/**
 * A local EVM instance running in JavaScript. Similar to Anvil in your browser
 * @param {import('@tevm/base-client').BaseClientOptions} [options]
 * @returns {import('./MemoryClient.js').MemoryClient}
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
	return createBaseClient(options)
		.extend(tevmSend())
		.extend(createEip1993EventEmitter())
		.extend(requestEip1193())
		.extend(ethActions())
		.extend(tevmActions())
}
