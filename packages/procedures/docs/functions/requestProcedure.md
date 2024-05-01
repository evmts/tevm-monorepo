**@tevm/procedures** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > requestProcedure

# Function: requestProcedure()

> **requestProcedure**(`client`): `TevmJsonRpcRequestHandler`

Request handler for JSON-RPC requests.

This implementation of the Tevm requestProcedure spec
implements it via the ethereumjs VM.

Most users will want to use `Tevm.request` instead of
this method but this method may be desired if hyper optimizing
bundle size.

## Parameters

▪ **client**: `object`

▪ **client.extend**: \<`TExtension`\>(`decorator`) => `BaseClient`\<`"fork"` \| `"normal"`, `object` & `TExtension`\>

Extends the base client with additional functionality. This enables optimal code splitting
and extensibility

▪ **client.forkUrl?**: `string`

Fork url if the EVM is forked

**Example**

```ts
const client = createMemoryClient({ forkUrl: 'https://mainnet.infura.io/v3/your-api-key' })
console.log(client.forkUrl)
```

▪ **client.getReceiptsManager**: () => `Promise`\<`ReceiptsManager`\>

Interface for querying receipts and historical state

▪ **client.getTxPool**: () => `Promise`\<`TxPool`\>

Gets the pool of pending transactions to be included in next block

▪ **client.getVm**: () => `Promise`\<`TevmVm`\>

Internal instance of the VM. Can be used for lower level operations.
Normally not recomended to use unless building libraries or extensions
on top of Tevm.

▪ **client.logger**: `Logger`

The logger instance

▪ **client.miningConfig**: `MiningConfig`

The configuration for mining. Defaults to 'auto'
- 'auto' will mine a block on every transaction
- 'interval' will mine a block every `interval` milliseconds
- 'manual' will not mine a block automatically and requires a manual call to `mineBlock`

▪ **client.mode**: `"fork"` \| `"normal"`

The mode the current client is running in
`fork` mode will fetch and cache all state from the block forked from the provided URL
`normal` mode will not fetch any state and will only run the EVM in memory

**Example**

```ts
let client = createMemoryClient()
console.log(client.mode) // 'normal'
client = createMemoryClient({ forkUrl: 'https://mainnet.infura.io/v3/your-api-key' })
console.log(client.mode) // 'fork'
```

▪ **client.ready**: () => `Promise`\<`true`\>

Returns promise that resulves when the client is ready
The client is usable without calling this method but may
have extra latency on the first call from initialization

**Example**

```ts
const client = createMemoryClient()
await client.ready()
```

## Returns

## Example

```typescript
const blockNumberResponse = await tevm.request({
 method: 'eth_blockNumber',
 params: []
 id: 1
 jsonrpc: '2.0'
})
const accountResponse = await tevm.request({
 method: 'tevm_getAccount',
 params: [{address: '0x123...'}]
 id: 1
 jsonrpc: '2.0'
})
```

## Source

[procedures/src/requestProcedure.js:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/requestProcedure.js#L56)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
