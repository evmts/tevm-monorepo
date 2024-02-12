---
editUrl: false
next: false
prev: false
title: "MemoryClient"
---

> **MemoryClient**: [`TevmClient`](/reference/tevm/client-types/type-aliases/tevmclient/) & `object`

A local EVM instance running in JavaScript. Similar to Anvil in your browser/node/bun environments
Implements the [TevmClient](/reference/tevm/client-types/type-aliases/tevmclient/) interface with an in memory EVM instance.

## See

 - [TevmClient](../../client-types/type-aliases/TevmClient.md)
 - [WrappedEvm](../classes/WrappedEvm.md) for an remote client

## Example

```ts
import { createMemoryClient } from "tevm"
import { createPublicClient, http } from "viem"
import { MyERC721 } from './MyERC721.sol'

const tevm = createMemoryClient({
	fork: {
	  url: "https://mainnet.optimism.io",
	},
})

const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',

await tevm.contract(
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

## Type declaration

### \_vm

> **`readonly`** **\_vm**: `VM`

Internal instance of the VM. Can be used for lower level operations
but is not guaranteed to stay stable between versions

### forkUrl

> **`readonly`** **forkUrl**?: `string`

Fork url if the EVM is forked

### forkedBlock

> **`readonly`** **forkedBlock**?: `Block`

Forked block

### mode

> **`readonly`** **mode**: `"fork"` \| `"proxy"` \| `"normal"`

The mode the current client is running in
`fork` mode will fetch and cache all state from the block forked from the provided URL
`proxy` mode will fetch all state from the latest block of the provided proxy URL
`normal` mode will not fetch any state and will only run the EVM in memory

### name

> **`readonly`** **name**: `string`

Optional name to give the client

## Source

[packages/memory-client/src/MemoryClient.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/MemoryClient.ts#L39)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
