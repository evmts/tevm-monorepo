[**@tevm/procedures**](../README.md) • **Docs**

***

[@tevm/procedures](../globals.md) / getBalanceProcedure

# Function: getBalanceProcedure()

> **getBalanceProcedure**(`baseClient`): `EthGetBalanceJsonRpcProcedure`

## Parameters

• **baseClient**

• **baseClient.extend**

Extends the base client with additional functionality. This enables optimal code splitting
and extensibility

• **baseClient.forkUrl?**: `string`

Fork url if the EVM is forked

**Example**

```ts
const client = createMemoryClient({ forkUrl: 'https://mainnet.infura.io/v3/your-api-key' })
console.log(client.forkUrl)
```

• **baseClient.getChainCommon**

Returns the chain being used by the client. THis type extends both viem `Chain` and ethereumjs `Common`
This is the same object on `getVm().common`

• **baseClient.getReceiptsManager**

Interface for querying receipts and historical state

• **baseClient.getTxPool**

Gets the pool of pending transactions to be included in next block

• **baseClient.getVm**

Internal instance of the VM. Can be used for lower level operations.
Normally not recomended to use unless building libraries or extensions
on top of Tevm.

• **baseClient.logger**: `Logger`

The logger instance

• **baseClient.miningConfig**: `MiningConfig`

The configuration for mining. Defaults to 'auto'
- 'auto' will mine a block on every transaction
- 'interval' will mine a block every `interval` milliseconds
- 'manual' will not mine a block automatically and requires a manual call to `mineBlock`

• **baseClient.mode**: `"fork"` \| `"normal"`

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

• **baseClient.ready**

Returns promise that resulves when the client is ready
The client is usable without calling this method but may
have extra latency on the first call from initialization

**Example**

```ts
const client = createMemoryClient()
await client.ready()
```

## Returns

`EthGetBalanceJsonRpcProcedure`

## Source

[procedures/src/eth/getBalanceProcedure.js:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/eth/getBalanceProcedure.js#L8)
