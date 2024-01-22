**@tevm/memory-client** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > createMemoryClient

# Function: createMemoryClient()

> **createMemoryClient**(`options`?): `Promise`\<[`MemoryClient`](../type-aliases/MemoryClient.md)\>

A local EVM instance running in JavaScript. Similar to Anvil in your browser

## Parameters

▪ **options?**: [`CreateEVMOptions`](../type-aliases/CreateEVMOptions.md)= `{}`

## Returns

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

[packages/memory-client/src/createMemoryClient.js:59](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/createMemoryClient.js#L59)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
