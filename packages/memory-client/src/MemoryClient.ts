import type { WrappedEvm } from './WrappedEvm.js'
import type { VM } from '@ethereumjs/vm'
import type { Tevm } from '@tevm/client-spec'

/**
 * A local EVM instance running in JavaScript. Similar to Anvil in your browser/node/bun environments
 * Implements the {@link Tevm} interface with an in memory EVM instance.
 *
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
export type MemoryClient = Tevm & {
	/**
	 * Fork url if the EVM is forked
	 */
	readonly forkUrl?: string | undefined
	/**
	 * Internal instance of the EVM. Can be used for lower level operations
	 * but is not guaranteed to stay stable between versions
	 */
	readonly _evm: WrappedEvm
	/**
	 * Internal instance of the VM. Can be used for lower level operations
	 * but is not guaranteed to stay stable between versions
	 */
	readonly _vm: VM
}