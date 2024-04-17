**@tevm/procedures** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/procedures](../README.md) / dumpStateProcedure

# Function: dumpStateProcedure()

> **dumpStateProcedure**(`client`): `DumpStateJsonRpcProcedure`

Creates a DumpState JSON-RPC Procedure for handling dumpState requests with Ethereumjs EVM

## Parameters

• **client**

• **client\.extend**

Extends the base client with additional functionality. This enables optimal code splitting
and extensibility

• **client\.forkUrl?**: `string`

Fork url if the EVM is forked

**Example**
```ts
const client = createMemoryClient({ forkUrl: 'https://mainnet.infura.io/v3/your-api-key' })
console.log(client.forkUrl)
```

• **client\.getChain**

Represents the entire blockchain including it's logs and historical state

• **client\.getChainId**

Gets the chainId of the current EVM

**Example**
```ts
const client = createMemoryClient()
const chainId = await client.getChainId()
console.log(chainId)
```

• **client\.getReceiptsManager**

Interface for querying receipts and historical state

• **client\.getTxPool**

Gets the pool of pending transactions to be included in next block

• **client\.getVm**

Internal instance of the VM. Can be used for lower level operations.
Normally not recomended to use unless building libraries or extensions
on top of Tevm.

• **client\.logger**: `Logger`

The logger instance

• **client\.miningConfig**: `MiningConfig`

The configuration for mining. Defaults to 'auto'
- 'auto' will mine a block on every transaction
- 'interval' will mine a block every `interval` milliseconds
- 'manual' will not mine a block automatically and requires a manual call to `mineBlock`

• **client\.mode**: `"fork"` \| `"proxy"` \| `"normal"`

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

• **client\.ready**

Returns promise that resulves when the client is ready
The client is usable without calling this method but may
have extra latency on the first call from initialization

**Example**
```ts
const client = createMemoryClient()
await client.ready()
```

• **client\.setChainId**

Sets the chain id of the current EVM

## Returns

`DumpStateJsonRpcProcedure`

## Source

[procedures/src/tevm/dumpStateProcedure.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/tevm/dumpStateProcedure.js#L9)
