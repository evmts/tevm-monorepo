import type { BaseClient } from '@tevm/base-client'
import type { TevmClient } from '@tevm/client-types'

/**
 * A local EVM instance running in JavaScript. Similar to Anvil in your browser/node/bun environments
 * Implements the {@link TevmClient} interface with an in memory EVM instance.
 *
 * @see {@link TevmClient}
 * @see {@link https://todo.todo WrappedEvm} for an remote client
 * @example
 * ```ts
 * import { createMemoryClient } from "tevm"
 * import { createPublicClient, http } from "@tevm/utils"
 * import { MyERC721 } from './MyERC721.sol'
 *
 * const tevm = createMemoryClient({
 * 	fork: {
 * 	  url: "https://mainnet.optimism.io",
 * 	},
 * })
 *
 * const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',

 * await tevm.contract(
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
export type MemoryClient = TevmClient & BaseClient
