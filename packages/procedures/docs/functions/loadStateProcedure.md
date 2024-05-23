[**@tevm/procedures**](../README.md) • **Docs**

***

[@tevm/procedures](../globals.md) / loadStateProcedure

# Function: loadStateProcedure()

> **loadStateProcedure**(`client`): `LoadStateJsonRpcProcedure`

Creates a LoadState JSON-RPC Procedure for handling LoadState requests with Ethereumjs EVM

## Parameters

• **client**

• **client.extend**

Extends the base client with additional functionality. This enables optimal code splitting
and extensibility

• **client.forkUrl?**: `string`

Fork url if the EVM is forked

**Example**

```ts
const client = createMemoryClient({ forkUrl: 'https://mainnet.infura.io/v3/your-api-key' })
console.log(client.forkUrl)
```

• **client.getReceiptsManager**

Interface for querying receipts and historical state

• **client.getTxPool**

Gets the pool of pending transactions to be included in next block

• **client.getVm**

Internal instance of the VM. Can be used for lower level operations.
Normally not recomended to use unless building libraries or extensions
on top of Tevm.

• **client.logger**: `Logger`

The logger instance

• **client.miningConfig**: `MiningConfig`

The configuration for mining. Defaults to 'auto'
- 'auto' will mine a block on every transaction
- 'interval' will mine a block every `interval` milliseconds
- 'manual' will not mine a block automatically and requires a manual call to `mineBlock`

• **client.mode**: `"fork"` \| `"normal"`

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

• **client.ready**

Returns promise that resulves when the client is ready
The client is usable without calling this method but may
have extra latency on the first call from initialization

**Example**

```ts
const client = createMemoryClient()
await client.ready()
```

## Returns

`LoadStateJsonRpcProcedure`

## Source

[procedures/src/tevm/loadStateProcedure.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/tevm/loadStateProcedure.js#L9)
