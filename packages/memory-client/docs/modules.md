[@tevm/memory-client](README.md) / Exports

# @tevm/memory-client

## Table of contents

### Type Aliases

- [MemoryClient](modules.md#memoryclient)

### Functions

- [createMemoryClient](modules.md#creatememoryclient)

## Type Aliases

### MemoryClient

Ƭ **MemoryClient**: `TevmClient` & `BaseClient`

A local EVM instance running in JavaScript. Similar to Anvil in your browser/node/bun environments
Implements the TevmClient interface with an in memory EVM instance.

**`See`**

 - TevmClient
 - [WrappedEvm](https://todo.todo) for an remote client

**`Example`**

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

#### Defined in

[MemoryClient.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/MemoryClient.ts#L38)

## Functions

### createMemoryClient

▸ **createMemoryClient**(`options?`): `Promise`\<[`MemoryClient`](modules.md#memoryclient)\>

A local EVM instance running in JavaScript. Similar to Anvil in your browser

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `BaseClientOptions` |

#### Returns

`Promise`\<[`MemoryClient`](modules.md#memoryclient)\>

**`Example`**

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

#### Defined in

[createMemoryClient.js:35](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/createMemoryClient.js#L35)
