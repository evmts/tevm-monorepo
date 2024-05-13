**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > MemoryClient

# Type alias: MemoryClient

> **MemoryClient**: `Prettify`\<`Client`\<`Transport`, `undefined`, `undefined`, [`...PublicRpcSchema`, `...TestRpcSchema<"anvil" | "ganache" | "hardhat">`, [`JsonRpcSchemaTevm`](../../decorators/type-aliases/JsonRpcSchemaTevm.md)[`"tevm_call"`], [`JsonRpcSchemaTevm`](../../decorators/type-aliases/JsonRpcSchemaTevm.md)[`"tevm_script"`], [`JsonRpcSchemaTevm`](../../decorators/type-aliases/JsonRpcSchemaTevm.md)[`"tevm_dumpState"`], [`JsonRpcSchemaTevm`](../../decorators/type-aliases/JsonRpcSchemaTevm.md)[`"tevm_loadState"`], [`JsonRpcSchemaTevm`](../../decorators/type-aliases/JsonRpcSchemaTevm.md)[`"tevm_getAccount"`], [`JsonRpcSchemaTevm`](../../decorators/type-aliases/JsonRpcSchemaTevm.md)[`"tevm_setAccount"`]], `PublicActions` & `TestActions` & [`TevmActions`](../../memory-client/type-aliases/TevmActions.md)\>\>

A local EVM instance running in JavaScript. Similar to Anvil in your browser/node/bun environments
It wraps the viem [public client](https://viem.sh/docs/clients/public#public-client) and [test client](https://viem.sh/docs/clients/test)

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

## Source

packages/memory-client/types/MemoryClient.d.ts:39

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
