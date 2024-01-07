import type { TevmClient } from '@tevm/api'
import { createHttpHandler } from '@tevm/server'

/**
 * A local EVM instance running in JavaScript. Similar to Anvil in your browser
 * @example
 * ```ts
 * import { Tevm } from "tevm"
 * import { createPublicClient, http } from "viem"
 * import { MyERC721 } from './MyERC721.sol'
 *
 * const tevm = Tevm.create({
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
export type Tevm = TevmClient & {
	/**
	 * Fork url if the EVM is forked
	 */
	readonly forkUrl?: string | undefined
	/**
	 * Internal instance of the EVM. Can be used for lower level operations
	 * but is not guaranteed to stay stable between versions
	 */
	readonly _evm: import('@ethereumjs/evm').EVM
	/**
	 * Creates a HTTP handler for the tevm vm
	 */
	readonly createHttpHandler: () => ReturnType<typeof createHttpHandler>
}
