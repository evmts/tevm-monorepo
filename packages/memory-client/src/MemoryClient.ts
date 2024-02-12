import type { VM } from '@ethereumjs/vm'
import type { TevmClient } from '@tevm/client-types'
import { type Block } from 'viem'

/**
 * A local EVM instance running in JavaScript. Similar to Anvil in your browser/node/bun environments
 * Implements the {@link TevmClient} interface with an in memory EVM instance.
 *
 * @see {@link TevmClient}
 * @see {@link https://todo.todo WrappedEvm} for an remote client
 * @example
 * ```ts
 * import { createMemoryClient } from "tevm"
 * import { createPublicClient, http } from "viem"
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
export type MemoryClient = TevmClient & {
	/**
	 * Optional name to give the client
	 */
	readonly name: string
	/**
	 * Fork url if the EVM is forked
	 */
	readonly forkUrl?: string | undefined
	/**
	 * Forked block
	 */
	readonly forkedBlock?: Block | undefined
	/**
	 * Internal instance of the VM. Can be used for lower level operations
	 * but is not guaranteed to stay stable between versions
	 */
	readonly _vm: VM
	/**
	 * The mode the current client is running in
	 * `fork` mode will fetch and cache all state from the block forked from the provided URL
	 * `proxy` mode will fetch all state from the latest block of the provided proxy URL
	 * `normal` mode will not fetch any state and will only run the EVM in memory
	 */
	readonly mode: 'fork' | 'proxy' | 'normal'
}
