**@tevm/actions** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > getAccountHandler

# Function: getAccountHandler()

> **getAccountHandler**(`client`, `options`?): `GetAccountHandler`

Creates an GetAccountHandler for handling account params with Ethereumjs VM

## Parameters

▪ **client**: `object`

▪ **client.extend**: \<`TExtension`\>(`decorator`) => `BaseClient`\<`"fork"` \| `"proxy"` \| `"normal"`, `object` & `TExtension`\>

Extends the base client with additional functionality. This enables optimal code splitting
and extensibility

▪ **client.forkUrl?**: `string`

Fork url if the EVM is forked

**Example**

```ts
const client = createMemoryClient({ forkUrl: 'https://mainnet.infura.io/v3/your-api-key' })
console.log(client.forkUrl)
```

▪ **client.getChain?**: () => `Promise`\<`Chain`\>

Represents the entire blockchain including it's logs and historical state

▪ **client.getChainId?**: () => `Promise`\<`number`\>

Gets the chainId of the current EVM

**Example**

```ts
const client = createMemoryClient()
const chainId = await client.getChainId()
console.log(chainId)
```

▪ **client.getReceiptsManager?**: () => `Promise`\<`ReceiptsManager`\>

Interface for querying receipts and historical state

▪ **client.getTxPool?**: () => `Promise`\<`TxPool`\>

Gets the pool of pending transactions to be included in next block

▪ **client.getVm?**: () => `Promise`\<`TevmVm`\>

Internal instance of the VM. Can be used for lower level operations.
Normally not recomended to use unless building libraries or extensions
on top of Tevm.

▪ **client.miningConfig?**: `MiningConfig`

The configuration for mining. Defaults to 'auto'
- 'auto' will mine a block on every transaction
- 'interval' will mine a block every `interval` milliseconds
- 'manual' will not mine a block automatically and requires a manual call to `mineBlock`

▪ **client.mode?**: `"fork"` \| `"proxy"` \| `"normal"`

The mode the current client is running in
`fork` mode will fetch and cache all state from the block forked from the provided URL
`proxy` mode will fetch all state from the latest block of the provided proxy URL
`normal` mode will not fetch any state and will only run the EVM in memory

**Example**

```ts
let client = createMemoryClient()
console.log(client.mode) // 'normal'
client = createMemoryClient({ forkUrl: 'https://mainnet.infura.io/v3/your-api-key' })
console.log(client.mode) // 'fork'
```

▪ **client.ready?**: () => `Promise`\<`true`\>

Returns promise that resulves when the client is ready
The client is usable without calling this method but may
have extra latency on the first call from initialization

**Example**

```ts
const client = createMemoryClient()
await client.ready()
```

▪ **client.setChainId?**: (`chainId`) => `void`

Sets the chain id of the current EVM

▪ **options?**: `object`= `{}`

▪ **options.throwOnFail?**: `undefined` \| `boolean`

whether to default to throwing or not when errors occur

## Returns

## Source

[packages/actions/src/tevm/getAccountHandler.js:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/tevm/getAccountHandler.js#L15)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
