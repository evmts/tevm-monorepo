---
editUrl: false
next: false
prev: false
title: "MemoryClient"
---

> **MemoryClient**\<`TChain`, `TAccountOrAddress`\>: `Prettify`\<`Client`\<`Transport`, `TChain`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`, [`TevmRpcSchema`](/reference/tevm/memory-client/type-aliases/tevmrpcschema/), `PublicActions`\<`Transport`, `TChain`, `TAccountOrAddress` *extends* `Account` ? `Account` : `undefined`\> & [`TevmActions`](/reference/tevm/memory-client/type-aliases/tevmactions/)\>\>

A local EVM instance running in JavaScript. Similar to Anvil in your browser/node/bun environments
It wraps the viem [public client](https://viem.sh/docs/clients/public#public-client)

## See

 - TevmClient
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

• **TAccountOrAddress** *extends* `Account` \| [`Address`](/reference/tevm/utils/type-aliases/address/) \| `undefined` = `Account` \| [`Address`](/reference/tevm/utils/type-aliases/address/) \| `undefined`

## Defined in

[packages/memory-client/src/MemoryClient.ts:54](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/MemoryClient.ts#L54)
