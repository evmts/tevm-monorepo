---
editUrl: false
next: false
prev: false
title: "createMemoryClient"
---

> **createMemoryClient**(`options`?): [`MemoryClient`](/reference/type-aliases/memoryclient/)

A local EVM instance running in JavaScript. Similar to Anvil in your browser

## Parameters

• **options?**: [`BaseClientOptions`](/reference/base-client/type-aliases/baseclientoptions/)

## Returns

[`MemoryClient`](/reference/type-aliases/memoryclient/)

## Example

```ts
import { createMemoryClient } from "tevm"
import { MyERC721 } from './MyERC721.sol'

const tevm = createMemoryClient({
	fork: {
	  url: "https://mainnet.optimism.io",
	},
})

const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',

await tevm.runContractCall(
  MyERC721.write.mint({
    caller: address,
  }),
)

const balance = await tevm.runContractCall(
 MyERC721.read.balanceOf({
 caller: address,
 }),
 )
 console.log(balance) // 1n
 ```

## Source

[createMemoryClient.js:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/createMemoryClient.js#L41)
