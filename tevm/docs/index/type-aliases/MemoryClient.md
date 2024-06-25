[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / MemoryClient

# Type Alias: MemoryClient\<TChain, TAccountOrAddress\>

> **MemoryClient**\<`TChain`, `TAccountOrAddress`\>: `Prettify`\<`Client`\<`Transport`, `TChain`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`, `TevmRpcSchema`, `PublicActions`\<`Transport`, `TChain`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`\> & [`TevmActions`](TevmActions.md)\>\>

A local EVM instance running in JavaScript. Similar to Anvil in your browser/node/bun environments
It wraps the viem [public client](https://viem.sh/docs/clients/public#public-client)

## See

 - [TevmClient](TevmClient.md)
 - [WrappedEvm](https://todo.todo) for an remote client

## Example

```ts
import { createMemoryClient } from "tevm"
import { createPublicClient, http } from "@tevm/utils"
import { MyERC721 } from './MyERC721.sol'

const tevm = createMemoryClient({
	fork: {
	  transport: http("https://mainnet.optimism.io")({}),
	},
})

const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',

await tevm.tevmContract(
  MyERC721.write.mint({
    caller: address,
  }),
)

const balance = await tevm.tevmContract(
 MyERC721.read.balanceOf({
 caller: address,
 }),
 )
 console.log(balance) // 1n
 ```

 Test actions can be added with `client.extend`

 ```ts
 import {testActions} from 'viem'

 const tevm = createMemoryClient().extend(testActions({mode: 'anvil'}))

 tevm.setBytecode({
   address: `0x${'0'.repeat(40)}`,
   bytecode: '0x608060405234801561001057600080fd5b5060405',
 })
 ```

## Type Parameters

• **TChain** *extends* `Chain` \| `undefined` = `Chain` \| `undefined`

• **TAccountOrAddress** *extends* `Account` \| [`Address`](Address.md) \| `undefined` = `Account` \| [`Address`](Address.md) \| `undefined`

## Defined in

packages/memory-client/types/MemoryClient.d.ts:53
