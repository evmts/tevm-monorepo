import { createBaseClient } from '@tevm/base-client'
import { requestEip1193, tevmSend } from '@tevm/decorators'
import { createTransport } from 'viem'

// TODO strongly type this! Currently it's return type is inferred

/**
* Creates a TevmTransport which is a stateful devnet that can be used as a transport for both wagmi anv viem.
* @param {import('@tevm/base-client').BaseClientOptions} options
* @returns {import('./TevmTransport.js').TevmTransport}
* Usage with viem
* @example
* ```ts
* import { createTevmTransport } from "tevm"
* import { createClient } from 'viem'
*
* const client = createClient({
* 	fork: {
* 	  transport: http("https://mainnet.optimism.io")({}),
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
*  @see {@link https://tevm.sh/learn/clients/}
*
*  ## Actions API
*
*  TevmClient supports the following actions
*
*  - [Tevm actions api](https://tevm.sh/reference/tevm/memory-client/type-aliases/tevmactions/)
*
*  ```typescript
*  import { createTevmClient } from "tevm"
*  import { testActions } from "tevm/decorators"
*
*  const tevm = createTevmClient()
*  await tevm.setAccount({address: `0x${'01'.repeat(20)}`, balance: 100n})
*  ```
*  - [Viem public actions api](https://viem.sh/docs/actions/public/introduction) such as [getBlockNumber}(https://viem.sh/docs/actions/public/getBlockNumber)
*
*  ```typescript
*  import { createTevmClient } from "tevm"
*  import { testActions } from "tevm/decorators"
*
*  const tevm = createTevmClient()
*  const bn = await tevm.getBlockNumber()
*  ```
*
*  - [test actions](https://viem.sh/docs/actions/test/introduction) are not included by default but can be added via calling `.extend` on the client.`
*
*  ```typescript
*  import { createTevmClient } from "tevm"
*  import { testActions } from "tevm/decorators"
*
*  const tevm = createTevmClient().extend(testActions({mode: 'anvil'}))
*  tevm.setBalance({address: `0x${'01'.repeat(20)}`, balance: 100n})
*  ```
*
*  ## Forking
* 
* To fork an existing network simply pass an eip-1193 transport to the fork.transport option with an optional block tag.
* When you fork tevm will pin the block tag and lazily cache state from the fork transport.
* It's highly recomended to pass in a `common` object that matches the chain. This will increase the performance of forking with known values.
*
* ```typescript
* import { createTevmClient, http } from "tevm"
* import { optimism } from "tevm/common"
* 
* const forkedClient = createTevmClient({
*  fork: {
*    transport: http("https://mainnet.optimism.io")({}),
*  },
*  common: optimism,
* })
* ```
*
* Tevm clients are themselves EIP-1193 transports. This means you can fork a client with another client.
*
*/
export const createTevmTransport = (options = {}) => {
	const tevm = createBaseClient(options).extend(tevmSend()).extend(requestEip1193())
	/**
	 * @type {import('./TevmTransport.js').TevmTransport}
	 */
	const transport = ({ timeout = 20_000, retryCount = 3 }) => {
		// the createTranssport type incorrectly infers the return type to have optional tevm prop
		return /** @type {any}*/ (
			createTransport(
				{
					request: /** @type any*/ (tevm.request),
					type: 'tevm',
					name: /**options?.name ??*/ 'Tevm transport',
					key: /*options?.key ??*/ 'tevm',
					timeout,
					retryCount,
					retryDelay: /* options?.retryDelay ?? */ 150,
				},
				{ tevm },
			)
		)
	}
	transport.tevm = tevm
	return transport
}
