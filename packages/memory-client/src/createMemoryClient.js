import { createBaseClient } from '@tevm/base-client'
import { tevmDefault } from '@tevm/common'
import { requestEip1193, tevmActions, tevmSend } from '@tevm/decorators'
import { createClient, createTransport, publicActions } from 'viem'

// TODO strongly type this! Currently it's return type is inferred

/**
* Creates a {@link MemoryClient} which is an viem client with an in-memory ethereum client as it's transport.
* It wraps the viem [public client](https://viem.sh/docs/clients/public#public-client) and [test client](https://viem.sh/docs/clients/test)
* @type {import('./CreateMemoryClientFn.js').CreateMemoryClientFn} [options]
* @example
* ```ts
* import { createMemoryClient } from "tevm"
* import { MyERC721 } from './MyERC721.sol'
*
* const tevm = createMemoryClient({
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
*  MemoryClient supports the following actions
*
*  - [Tevm actions api](https://tevm.sh/reference/tevm/memory-client/type-aliases/tevmactions/)
*
*  ```typescript
*  import { createMemoryClient } from "tevm"
*  import { testActions } from "tevm/decorators"
*
*  const tevm = createMemoryClient()
*  await tevm.setAccount({address: `0x${'01'.repeat(20)}`, balance: 100n})
*  ```
*  - [Viem public actions api](https://viem.sh/docs/actions/public/introduction) such as [getBlockNumber}(https://viem.sh/docs/actions/public/getBlockNumber)
*
*  ```typescript
*  import { createMemoryClient } from "tevm"
*  import { testActions } from "tevm/decorators"
*
*  const tevm = createMemoryClient()
*  const bn = await tevm.getBlockNumber()
*  ```
*
*  - [test actions](https://viem.sh/docs/actions/test/introduction) are not included by default but can be added via calling `.extend` on the client.`
*
*  ```typescript
*  import { createMemoryClient } from "tevm"
*  import { testActions } from "tevm/decorators"
*
*  const tevm = createMemoryClient().extend(testActions({mode: 'anvil'}))
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
* import { createMemoryClient, http } from "tevm"
* import { optimism } from "tevm/common"
* 
* const forkedClient = createMemoryClient({
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
export const createMemoryClient = (options) => {
	const tevm = createBaseClient(options).extend(tevmSend()).extend(requestEip1193()).extend(tevmActions())
	return /** @type any*/ (
		createClient({
			...options,
			type: /** @type any*/ (options).type ?? 'tevm',
			.../** @type any*/ (options?.common !== undefined ? { chain: options.common } : { chain: tevmDefault }),
			transport: () =>
				createTransport({
					request: /** @type any*/ (tevm.request),
					type: 'tevm',
					name: /**options?.name ??*/ 'Tevm transport',
					key: /*options?.key ??*/ 'tevm',
					timeout: /*options?.timeout ?? */ 20_000,
					retryCount: /*options?.retryCount ??*/ 3,
					retryDelay: /* options?.retryDelay ?? */ 150,
				}),
		})
			.extend(publicActions)
			.extend(() => {
				return {
					_tevm: tevm,
					tevmReady: tevm.ready,
					tevmCall: tevm.call,
					tevmContract: tevm.contract,
					tevmScript: tevm.script,
					tevmDeploy: tevm.deploy,
					tevmMine: tevm.mine,
					tevmLoadState: tevm.loadState,
					tevmDumpState: tevm.dumpState,
					tevmSetAccount: tevm.setAccount,
					tevmGetAccount: tevm.getAccount,
					...(tevm.forkTransport !== undefined ? { forkTransport: tevm.forkTransport } : {}),
				}
			})
	)
}
