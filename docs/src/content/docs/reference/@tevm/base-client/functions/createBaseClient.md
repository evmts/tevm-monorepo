---
editUrl: false
next: false
prev: false
title: "createBaseClient"
---

> **createBaseClient**(`options`?): `object`

Creates the base instance of a memory client

## Parameters

• **options?**: [`BaseClientOptions`](/reference/tevm/base-client/type-aliases/baseclientoptions/)= `{}`

## Returns

`object`

### extend()

> `readonly` **extend**: \<`TExtension`\>(`decorator`) => [`BaseClient`](/reference/tevm/base-client/type-aliases/baseclient/)\<`"fork"` \| `"normal"`, `object` & `TExtension`\>

Extends the base client with additional functionality. This enables optimal code splitting
and extensibility

#### Type parameters

• **TExtension** *extends* `Record`\<`string`, `any`\>

#### Parameters

• **decorator**

#### Returns

[`BaseClient`](/reference/tevm/base-client/type-aliases/baseclient/)\<`"fork"` \| `"normal"`, `object` & `TExtension`\>

### forkUrl?

> `optional` `readonly` **forkUrl**: `string`

Fork url if the EVM is forked

#### Example

```ts
const client = createMemoryClient({ forkUrl: 'https://mainnet.infura.io/v3/your-api-key' })
console.log(client.forkUrl)
```

### getChainCommon()

> `readonly` **getChainCommon**: () => `Promise`\<`TevmChainCommon`\>

Returns the chain being used by the client. THis type extends both viem `Chain` and ethereumjs `Common`
This is the same object on `getVm().common`

#### Returns

`Promise`\<`TevmChainCommon`\>

### getReceiptsManager()

> `readonly` **getReceiptsManager**: () => `Promise`\<`ReceiptsManager`\>

Interface for querying receipts and historical state

#### Returns

`Promise`\<`ReceiptsManager`\>

### getTxPool()

> `readonly` **getTxPool**: () => `Promise`\<`TxPool`\>

Gets the pool of pending transactions to be included in next block

#### Returns

`Promise`\<`TxPool`\>

### getVm()

> `readonly` **getVm**: () => `Promise`\<[`Vm`](/reference/tevm/vm/type-aliases/vm/)\>

Internal instance of the VM. Can be used for lower level operations.
Normally not recomended to use unless building libraries or extensions
on top of Tevm.

#### Returns

`Promise`\<[`Vm`](/reference/tevm/vm/type-aliases/vm/)\>

### logger

> `readonly` **logger**: `Logger`

The logger instance

### miningConfig

> `readonly` **miningConfig**: [`MiningConfig`](/reference/tevm/base-client/type-aliases/miningconfig/)

The configuration for mining. Defaults to 'auto'
- 'auto' will mine a block on every transaction
- 'interval' will mine a block every `interval` milliseconds
- 'manual' will not mine a block automatically and requires a manual call to `mineBlock`

### mode

> `readonly` **mode**: `"fork"` \| `"normal"`

The mode the current client is running in
`fork` mode will fetch and cache all state from the block forked from the provided URL
`normal` mode will not fetch any state and will only run the EVM in memory

#### Example

```ts
let client = createMemoryClient()
console.log(client.mode) // 'normal'
client = createMemoryClient({ forkUrl: 'https://mainnet.infura.io/v3/your-api-key' })
console.log(client.mode) // 'fork'
```

### ready()

> `readonly` **ready**: () => `Promise`\<`true`\>

Returns promise that resulves when the client is ready
The client is usable without calling this method but may
have extra latency on the first call from initialization

#### Example

```ts
const client = createMemoryClient()
await client.ready()
```

#### Returns

`Promise`\<`true`\>

## Example

```ts
 ```

## Source

[createBaseClient.js:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/base-client/src/createBaseClient.js#L28)
