[**@tevm/memory-client**](../README.md) • **Docs**

***

[@tevm/memory-client](../globals.md) / MemoryClient

# Type alias: MemoryClient

> **MemoryClient**: `Prettify`\<`Client`\<`Transport`, `undefined`, `undefined`, [`...PublicRpcSchema`, ...TestRpcSchema\<"anvil" \| "ganache" \| "hardhat"\>, `JsonRpcSchemaTevm`\[`"tevm_call"`\], `JsonRpcSchemaTevm`\[`"tevm_script"`\], `JsonRpcSchemaTevm`\[`"tevm_dumpState"`\], `JsonRpcSchemaTevm`\[`"tevm_loadState"`\], `JsonRpcSchemaTevm`\[`"tevm_getAccount"`\], `JsonRpcSchemaTevm`\[`"tevm_setAccount"`\]], `PublicActions` & `TestActions` & [`TevmActions`](TevmActions.md)\>\>

A local EVM instance running in JavaScript. Similar to Anvil in your browser/node/bun environments
It wraps the viem [public client](https://viem.sh/docs/clients/public#public-client) and [test client](https://viem.sh/docs/clients/test)

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

## Source

[packages/memory-client/src/MemoryClient.ts:40](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/MemoryClient.ts#L40)
