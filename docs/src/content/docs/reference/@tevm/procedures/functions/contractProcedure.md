---
editUrl: false
next: false
prev: false
title: "contractProcedure"
---

> **contractProcedure**(`client`): `CallJsonRpcProcedure`

Creates a Contract JSON-RPC Procedure for handling contract requests with Ethereumjs EVM
Because the Contract handler is a quality of life wrapper around a call for the JSON rpc interface
we simply overload call instead of creating a seperate tevm_contract method

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

• **client.miningConfig**: [`MiningConfig`](/reference/tevm/base-client/type-aliases/miningconfig/)

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

`CallJsonRpcProcedure`

## Source

[procedures/src/tevm/contractProcedure.js:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/tevm/contractProcedure.js#L8)
