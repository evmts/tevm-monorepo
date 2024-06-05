[**@tevm/base-client**](../README.md) • **Docs**

***

[@tevm/base-client](../globals.md) / BaseClient

# Type alias: BaseClient\<TMode, TExtended\>

> **BaseClient**\<`TMode`, `TExtended`\>: `object` & [`EIP1193EventEmitter`](EIP1193EventEmitter.md) & `TExtended`

The base client used by Tevm. Add extensions to add additional functionality

## Type declaration

### extend()

> `readonly` **extend**: \<`TExtension`\>(`decorator`) => [`BaseClient`](BaseClient.md)\<`TMode`, `TExtended` & `TExtension`\>

Extends the base client with additional functionality. This enables optimal code splitting
and extensibility

#### Type parameters

• **TExtension** *extends* `Record`\<`string`, `any`\>

#### Parameters

• **decorator**

#### Returns

[`BaseClient`](BaseClient.md)\<`TMode`, `TExtended` & `TExtension`\>

### forkTransport?

> `optional` `readonly` **forkTransport**: `object`

Client to make json rpc requests to a forked node

#### Example

```ts
const client = createMemoryClient({ request: eip1193RequestFn })
```

### forkTransport.request

> **request**: `EIP1193RequestFn`

### getFilters()

> `readonly` **getFilters**: () => `Map`\<`Hex`, [`Filter`](Filter.md)\>

Gets all registered filters mapped by id

#### Returns

`Map`\<`Hex`, [`Filter`](Filter.md)\>

### getImpersonatedAccount()

> `readonly` **getImpersonatedAccount**: () => `Address` \| `undefined`

The currently impersonated account. This is only used in `fork` mode

#### Returns

`Address` \| `undefined`

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

> `readonly` **getVm**: () => `Promise`\<`Vm`\>

Internal instance of the VM. Can be used for lower level operations.
Normally not recomended to use unless building libraries or extensions
on top of Tevm.

#### Returns

`Promise`\<`Vm`\>

### logger

> `readonly` **logger**: `Logger`

The logger instance

### miningConfig

> `readonly` **miningConfig**: [`MiningConfig`](MiningConfig.md)

The configuration for mining. Defaults to 'auto'
- 'auto' will mine a block on every transaction
- 'interval' will mine a block every `interval` milliseconds
- 'manual' will not mine a block automatically and requires a manual call to `mineBlock`

### mode

> `readonly` **mode**: `TMode`

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

### removeFilter()

> `readonly` **removeFilter**: (`id`) => `void`

Removes a filter by id

#### Parameters

• **id**: `Hex`

#### Returns

`void`

### setFilter()

> `readonly` **setFilter**: (`filter`) => `void`

Creates a new filter to watch for logs events and blocks

#### Parameters

• **filter**: [`Filter`](Filter.md)

#### Returns

`void`

### setImpersonatedAccount()

> `readonly` **setImpersonatedAccount**: (`address`) => `void`

Sets the account to impersonate. This will allow the client to act as if it is that account
On Ethereum JSON_RPC endpoints. Pass in undefined to stop impersonating

#### Parameters

• **address**: `Address` \| `undefined`

#### Returns

`void`

## Type parameters

• **TMode** *extends* `"fork"` \| `"normal"` = `"fork"` \| `"normal"`

• **TExtended** = `object`

## Source

[packages/base-client/src/BaseClient.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/base-client/src/BaseClient.ts#L14)
