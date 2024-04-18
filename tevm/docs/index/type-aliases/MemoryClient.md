**tevm** • [Readme](../../README.md) \| [API](../../modules.md)

***

[tevm](../../README.md) / [index](../README.md) / MemoryClient

# Type alias: MemoryClient

> **MemoryClient**: [`BaseClient`](BaseClient.md) & [`EthActionsApi`](EthActionsApi.md) & [`TevmActionsApi`](TevmActionsApi.md) & [`EIP1193EventEmitter`](../../decorators/type-aliases/EIP1193EventEmitter.md) & [`Eip1193RequestProvider`](Eip1193RequestProvider.md) & `object` & `object`

A local EVM instance running in JavaScript. Similar to Anvil in your browser/node/bun environments
Implements the [TevmClient](TevmClient.md) interface with an in memory EVM instance.

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

### send

> **send**: [`TevmJsonRpcRequestHandler`](TevmJsonRpcRequestHandler.md)

## Type declaration

### sendBulk

> **sendBulk**: [`TevmJsonRpcBulkRequestHandler`](TevmJsonRpcBulkRequestHandler.md)

## Source

packages/memory-client/types/MemoryClient.d.ts:38
