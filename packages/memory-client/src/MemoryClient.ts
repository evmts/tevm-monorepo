import { type JsonRpcSchemaTevm } from '@tevm/decorators'
import type { Client, PublicActions, PublicRpcSchema, TestActions, TestRpcSchema, Transport } from 'viem'
import type { Prettify } from 'viem/chains'
import type { TevmActions } from './TevmActions.js'

/**
* A local EVM instance running in JavaScript. Similar to Anvil 
* It wraps the viem [public client](https://viem.sh/docs/clients/public#public-client) and [test client](https://viem.sh/docs/clients/test)
* It also supports powerful [tevm actions](https://tevm.sh/learn/actions/) prefixed with `tevm`
* _tevm has the internal api for low level control of the EVM
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
*  @see {@link https://tevm.sh/learn/client/} for more information on the `tevm` clients
*  @see {@link https://tevm.sh/learn/actions/} for more information on the `tevm` actions
*/
export type MemoryClient = Prettify<
Client<
Transport,
undefined,
undefined,
[
...PublicRpcSchema,
...TestRpcSchema<'anvil' | 'ganache' | 'hardhat'>,
JsonRpcSchemaTevm['tevm_call'],
JsonRpcSchemaTevm['tevm_script'],
JsonRpcSchemaTevm['tevm_dumpState'],
JsonRpcSchemaTevm['tevm_loadState'],
JsonRpcSchemaTevm['tevm_getAccount'],
JsonRpcSchemaTevm['tevm_setAccount'],
],
PublicActions & TestActions & TevmActions
>
>
