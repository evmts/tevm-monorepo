---
editUrl: false
next: false
prev: false
title: "requestBulkProcedure"
---

> **requestBulkProcedure**(`client`): `TevmJsonRpcBulkRequestHandler`

## Parameters

• **client**

• **client.extend**

Extends the base client with additional functionality. This enables optimal code splitting
and extensibility

• **client.forkTransport?**

Client to make json rpc requests to a forked node

**Example**

```ts
const client = createMemoryClient({ request: eip1193RequestFn })
```

• **client.forkTransport.request**: `EIP1193RequestFn`

• **client.getReceiptsManager**

Interface for querying receipts and historical state

• **client.getTxPool**

Gets the pool of pending transactions to be included in next block

• **client.getVm**

Internal instance of the VM. Can be used for lower level operations.
Normally not recomended to use unless building libraries or extensions
on top of Tevm.

• **client.impersonatedAccount**: `undefined` \| \`0x$\{string\}\`

The currently impersonated account. This is only used in `fork` mode

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

• **client.setImpersonatedAccount**

Sets the account to impersonate. This will allow the client to act as if it is that account
On Ethereum JSON_RPC endpoints. Pass in undefined to stop impersonating

## Returns

`TevmJsonRpcBulkRequestHandler`

## Source

[procedures/src/requestBulkProcedure.js:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/requestBulkProcedure.js#L7)
