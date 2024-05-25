[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / scriptHandler

# Function: scriptHandler()

> **scriptHandler**(`client`, `options`?): `ScriptHandler`

Creates an ScriptHandler for handling script params with Ethereumjs EVM

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

• **client.forkTransport.request?**: `EIP1193RequestFn`

• **client.getReceiptsManager?**

Interface for querying receipts and historical state

• **client.getTxPool?**

Gets the pool of pending transactions to be included in next block

• **client.getVm?**

Internal instance of the VM. Can be used for lower level operations.
Normally not recomended to use unless building libraries or extensions
on top of Tevm.

• **client.impersonatedAccount?**: `undefined` \| \`0x$\{string\}\`

The currently impersonated account. This is only used in `fork` mode

• **client.logger?**: `Logger`

The logger instance

• **client.miningConfig?**: `MiningConfig`

The configuration for mining. Defaults to 'auto'
- 'auto' will mine a block on every transaction
- 'interval' will mine a block every `interval` milliseconds
- 'manual' will not mine a block automatically and requires a manual call to `mineBlock`

• **client.mode?**: `"fork"` \| `"normal"`

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

• **client.ready?**

Returns promise that resulves when the client is ready
The client is usable without calling this method but may
have extra latency on the first call from initialization

**Example**

```ts
const client = createMemoryClient()
await client.ready()
```

• **client.setImpersonatedAccount?**

Sets the account to impersonate. This will allow the client to act as if it is that account
On Ethereum JSON_RPC endpoints. Pass in undefined to stop impersonating

• **options?**= `{}`

• **options.throwOnFail?**: `undefined` \| `boolean`

whether to default to throwing or not when errors occur

## Returns

`ScriptHandler`

## Source

[packages/actions/src/tevm/scriptHandler.js:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/tevm/scriptHandler.js#L20)
