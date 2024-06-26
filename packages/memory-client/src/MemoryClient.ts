import type { Address } from '@tevm/utils'
import type { Account, Chain, Client, PublicActions, Transport } from 'viem'
import type { Prettify } from 'viem/chains'
import type { TevmActions } from './TevmActions.js'
import type { TevmRpcSchema } from './TevmRpcSchema.js'

/**
* A local EVM instance running in JavaScript. Similar to Anvil in your browser/node/bun environments
* It wraps the viem [public client](https://viem.sh/docs/clients/public#public-client) 
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
* 	  transport: http("https://mainnet.optimism.io")({}),
* 	},
* })
*
* const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',

* await tevm.tevmContract(
*   MyERC721.write.mint({
*     caller: address,
*   }),
* )
*
* const balance = await tevm.tevmContract(
*  MyERC721.read.balanceOf({
*  caller: address,
*  }),
*  )
*  console.log(balance) // 1n
*  ```
*
*  Test actions can be added with `client.extend`
*
*  ```ts
*  import {testActions} from 'viem'
*
*  const tevm = createMemoryClient().extend(testActions({mode: 'anvil'}))
*
*  tevm.setBytecode({
*    address: `0x${'0'.repeat(40)}`,
*    bytecode: '0x608060405234801561001057600080fd5b5060405',
*  })
*  ```
*/
export type MemoryClient<
	TChain extends Chain | undefined = Chain | undefined,
	TAccountOrAddress extends Account | Address | undefined = Account | Address | undefined,
> = Prettify<
	Client<
		Transport,
		TChain,
		TAccountOrAddress extends Account ? Account : undefined,
		TevmRpcSchema,
		PublicActions<Transport, TChain, TAccountOrAddress extends Account ? Account : undefined> & TevmActions
	>
>
