**@tevm/memory-client** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > MemoryClient

# Type alias: MemoryClient

> **MemoryClient**: `BaseClient` & `EthActionsApi` & `TevmActionsApi` & `EIP1193EventEmitter` & `Eip1193RequestProvider` & `object` & `object`

A local EVM instance running in JavaScript. Similar to Anvil in your browser/node/bun environments
Implements the TevmClient interface with an in memory EVM instance.

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

> **send**: `TevmJsonRpcRequestHandler`

## Type declaration

### sendBulk

> **sendBulk**: `TevmJsonRpcBulkRequestHandler`

## Source

[MemoryClient.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/MemoryClient.ts#L39)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
