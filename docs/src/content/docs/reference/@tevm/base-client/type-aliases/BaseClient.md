---
editUrl: false
next: false
prev: false
title: "BaseClient"
---

> **BaseClient**\<`TMode`, `TExtended`\>: `object` & `TExtended`

The base client used by Tevm. Add extensions to add additional functionality

## Type declaration

### extend

> **`readonly`** **extend**: \<`TExtension`\>(`decorator`) => [`BaseClient`](/reference/tevm/base-client/type-aliases/baseclient/)\<`TMode`, `TExtended` & `TExtension`\>

Extends the base client with additional functionality. This enables optimal code splitting
and extensibility

Extends the base client with additional functionality. This enables optimal code splitting
and extensibility

#### Type parameters

▪ **TExtension** extends `Record`\<`string`, `any`\>

#### Parameters

▪ **decorator**: (`client`) => `TExtension`

### forkUrl

> **`readonly`** **forkUrl**?: `string`

Fork url if the EVM is forked

#### Example

```ts
const client = createMemoryClient({ forkUrl: 'https://mainnet.infura.io/v3/your-api-key' })
console.log(client.forkUrl)
```

### getChainId

> **`readonly`** **getChainId**: () => `Promise`\<`number`\>

Gets the chainId of the current EVM

#### Example

```ts
const client = createMemoryClient()
const chainId = await client.getChainId()
console.log(chainId)
```

Gets the chainId of the current EVM

#### Returns

#### Example

```ts
const client = createMemoryClient()
const chainId = await client.getChainId()
console.log(chainId)
```

### getTxPool

> **`readonly`** **getTxPool**: () => `Promise`\<`TxPool`\>

Gets the pool of pending transactions to be included in next block

Gets the pool of pending transactions to be included in next block

### getVm

> **`readonly`** **getVm**: () => `Promise`\<[`TevmVm`](/reference/tevm/vm/classes/tevmvm/)\>

Internal instance of the VM. Can be used for lower level operations.
Normally not recomended to use unless building libraries or extensions
on top of Tevm.

Internal instance of the VM. Can be used for lower level operations.
Normally not recomended to use unless building libraries or extensions
on top of Tevm.

### miningConfig

> **`readonly`** **miningConfig**: [`MiningConfig`](/reference/tevm/base-client/type-aliases/miningconfig/)

The configuration for mining. Defaults to 'auto'
- 'auto' will mine a block on every transaction
- 'interval' will mine a block every `interval` milliseconds
- 'manual' will not mine a block automatically and requires a manual call to `mineBlock`

### mode

> **`readonly`** **mode**: `TMode`

The mode the current client is running in
`fork` mode will fetch and cache all state from the block forked from the provided URL
`proxy` mode will fetch all state from the latest block of the provided proxy URL
`normal` mode will not fetch any state and will only run the EVM in memory

#### Example

```ts
let client = createMemoryClient()
console.log(client.mode) // 'normal'
client = createMemoryClient({ forkUrl: 'https://mainnet.infura.io/v3/your-api-key' })
console.log(client.mode) // 'fork'
```

### ready

> **`readonly`** **ready**: () => `Promise`\<`true`\>

Returns promise that resulves when the client is ready
The client is usable without calling this method but may
have extra latency on the first call from initialization

#### Example

```ts
const client = createMemoryClient()
await client.ready()
```

Returns promise that resulves when the client is ready
The client is usable without calling this method but may
have extra latency on the first call from initialization

#### Returns

#### Example

```ts
const client = createMemoryClient()
await client.ready()
```

### setChainId

> **`readonly`** **setChainId**: (`chainId`) => `void`

Sets the chain id of the current EVM

Sets the chain id of the current EVM

#### Parameters

▪ **chainId**: `number`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TMode` extends `"fork"` \| `"proxy"` \| `"normal"` | `"fork"` \| `"proxy"` \| `"normal"` |
| `TExtended` | `object` |

## Source

[BaseClient.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/base-client/src/BaseClient.ts#L8)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
