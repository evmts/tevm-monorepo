**@tevm/base-client** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/base-client](../README.md) / createBaseClient

# Function: createBaseClient()

> **createBaseClient**(`options`?): `object`

Creates the base instance of a memory client

## Parameters

• **options?**: [`BaseClientOptions`](../type-aliases/BaseClientOptions.md)= `{}`

## Returns

`object`

### extend()

> **`readonly`** **extend**: \<`TExtension`\>(`decorator`) => [`BaseClient`](../type-aliases/BaseClient.md)\<`"fork"` \| `"proxy"` \| `"normal"`, `object` & `TExtension`\>

Extends the base client with additional functionality. This enables optimal code splitting
and extensibility

#### Type parameters

• **TExtension** extends `Record`\<`string`, `any`\>

#### Parameters

• **decorator**

#### Returns

[`BaseClient`](../type-aliases/BaseClient.md)\<`"fork"` \| `"proxy"` \| `"normal"`, `object` & `TExtension`\>

### forkUrl?

> **`optional`** **`readonly`** **forkUrl**: `string`

Fork url if the EVM is forked

#### Example

```ts
const client = createMemoryClient({ forkUrl: 'https://mainnet.infura.io/v3/your-api-key' })
console.log(client.forkUrl)
```

### getChain()

> **`readonly`** **getChain**: () => `Promise`\<`Chain`\>

Represents the entire blockchain including it's logs and historical state

#### Returns

`Promise`\<`Chain`\>

### getChainId()

> **`readonly`** **getChainId**: () => `Promise`\<`number`\>

Gets the chainId of the current EVM

#### Example

```ts
const client = createMemoryClient()
const chainId = await client.getChainId()
console.log(chainId)
```

#### Returns

`Promise`\<`number`\>

### getReceiptsManager()

> **`readonly`** **getReceiptsManager**: () => `Promise`\<`ReceiptsManager`\>

Interface for querying receipts and historical state

#### Returns

`Promise`\<`ReceiptsManager`\>

### getTxPool()

> **`readonly`** **getTxPool**: () => `Promise`\<`TxPool`\>

Gets the pool of pending transactions to be included in next block

#### Returns

`Promise`\<`TxPool`\>

### getVm()

> **`readonly`** **getVm**: () => `Promise`\<`TevmVm`\>

Internal instance of the VM. Can be used for lower level operations.
Normally not recomended to use unless building libraries or extensions
on top of Tevm.

#### Returns

`Promise`\<`TevmVm`\>

### logger

> **`readonly`** **logger**: `Logger`

The logger instance

### miningConfig

> **`readonly`** **miningConfig**: [`MiningConfig`](../type-aliases/MiningConfig.md)

The configuration for mining. Defaults to 'auto'
- 'auto' will mine a block on every transaction
- 'interval' will mine a block every `interval` milliseconds
- 'manual' will not mine a block automatically and requires a manual call to `mineBlock`

### mode

> **`readonly`** **mode**: `"fork"` \| `"proxy"` \| `"normal"`

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

### ready()

> **`readonly`** **ready**: () => `Promise`\<`true`\>

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

### setChainId()

> **`readonly`** **setChainId**: (`chainId`) => `void`

Sets the chain id of the current EVM

#### Parameters

• **chainId**: `number`

#### Returns

`void`

## Example

```ts
 ```

## Source

[createBaseClient.js:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/base-client/src/createBaseClient.js#L23)
