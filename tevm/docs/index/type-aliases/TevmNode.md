[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / TevmNode

# Type Alias: TevmNode\<TMode, TExtended\>

> **TevmNode**\<`TMode`, `TExtended`\> = `object` & [`EIP1193EventEmitter`](EIP1193EventEmitter.md) & `TExtended`

The base client used by Tevm. Add extensions to add additional functionality

## Type Declaration

### addSnapshot

> `readonly` **addSnapshot**: (`stateRoot`, `state`, `metadata?`) => `string`

Adds a new snapshot and returns its ID (hex string like "0x1")
Used by evm_snapshot RPC method

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `stateRoot` | `string` |
| `state` | [`TevmState`](TevmState.md) |
| `metadata?` | [`SnapshotMetadata`](../../node/type-aliases/SnapshotMetadata.md) |

#### Returns

`string`

### close

> `readonly` **close**: () => `void`

Closes the client and stops any running interval mining.
This should be called when the client is no longer needed to prevent resource leaks.

#### Returns

`void`

#### Example

```ts
const client = createTevmNode({
  miningConfig: { type: 'interval', blockTime: 5 }
})

// Use the client...

// Clean up when done
client.close()
```

### consensus

> `readonly` **consensus**: `ConsensusService`

Consensus service used for trust assumptions and proof-backed reads.

### debug?

> `readonly` `optional` **debug?**: () => `Promise`\<\{ `blocks`: \{ `forked?`: [`JsonHeader`](../../block/interfaces/JsonHeader.md); `latest?`: [`JsonHeader`](../../block/interfaces/JsonHeader.md); \}; `chainId`: `number`; `chainName`: `string`; `eips`: `number`[]; `hardfork`: `string`; `miningConfig`: [`MiningConfig`](MiningConfig.md); `mode`: `TMode`; `receipts`: `Awaited`\<`ReturnType`\<[`ReceiptsManager`](../../receipt-manager/classes/ReceiptsManager.md)\[`"getLogs"`\]\>\>; `registeredFilters`: `Map`\<[`Hex`](Hex.md), [`Filter`](Filter.md)\>; `state`: [`TevmState`](TevmState.md); `status`: `"INITIALIZING"` \| `"READY"` \| `"SYNCING"` \| `"MINING"` \| `"STOPPED"`; `txsInMempool`: `number`; \}\>

Returns debug information about the current node state
including chain details, status, mode, mining config, filters,
blocks, mempool transactions, and state

#### Returns

`Promise`\<\{ `blocks`: \{ `forked?`: [`JsonHeader`](../../block/interfaces/JsonHeader.md); `latest?`: [`JsonHeader`](../../block/interfaces/JsonHeader.md); \}; `chainId`: `number`; `chainName`: `string`; `eips`: `number`[]; `hardfork`: `string`; `miningConfig`: [`MiningConfig`](MiningConfig.md); `mode`: `TMode`; `receipts`: `Awaited`\<`ReturnType`\<[`ReceiptsManager`](../../receipt-manager/classes/ReceiptsManager.md)\[`"getLogs"`\]\>\>; `registeredFilters`: `Map`\<[`Hex`](Hex.md), [`Filter`](Filter.md)\>; `state`: [`TevmState`](TevmState.md); `status`: `"INITIALIZING"` \| `"READY"` \| `"SYNCING"` \| `"MINING"` \| `"STOPPED"`; `txsInMempool`: `number`; \}\>

### deepCopy

> `readonly` **deepCopy**: () => `Promise`\<`TevmNode`\<`TMode`, `TExtended`\>\>

Copies the current client state into a new client

#### Returns

`Promise`\<`TevmNode`\<`TMode`, `TExtended`\>\>

### deleteSnapshotsFrom

> `readonly` **deleteSnapshotsFrom**: (`snapshotId`) => `void`

Deletes snapshots with IDs greater than or equal to the given ID
This is needed because reverting invalidates all subsequent snapshots

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `snapshotId` | `string` |

#### Returns

`void`

### emitExExEvent

> `readonly` **emitExExEvent**: (`event`) => `Promise`\<`void`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | [`ExExEvent`](../../node/type-aliases/ExExEvent.md) |

#### Returns

`Promise`\<`void`\>

### extend

> `readonly` **extend**: \<`TExtension`\>(`decorator`) => `TevmNode`\<`TMode`, `TExtended` & `TExtension`\>

Extends the base client with additional functionality. This enables optimal code splitting
and extensibility

#### Type Parameters

| Type Parameter |
| ------ |
| `TExtension` *extends* `Record`\<`string`, `any`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `decorator` | (`client`) => `TExtension` |

#### Returns

`TevmNode`\<`TMode`, `TExtended` & `TExtension`\>

### forkTransport?

> `readonly` `optional` **forkTransport?**: `object`

Client to make json rpc requests to a forked node

#### Type Declaration

#### Example

```ts
const client = createMemoryClient({ request: eip1193RequestFn })
```

#### forkTransport.request

> **request**: `EIP1193RequestFn`

### getAutoImpersonate

> `readonly` **getAutoImpersonate**: () => `boolean`

Gets whether auto-impersonation is enabled.
When enabled, all transaction senders are automatically impersonated.

#### Returns

`boolean`

### getBlockTimestampInterval

> `readonly` **getBlockTimestampInterval**: () => `bigint` \| `undefined`

Gets the automatic timestamp interval added between blocks
If undefined, no automatic interval is applied

#### Returns

`bigint` \| `undefined`

### getFilters

> `readonly` **getFilters**: () => `Map`\<[`Hex`](Hex.md), [`Filter`](Filter.md)\>

Gets all registered filters mapped by id

#### Returns

`Map`\<[`Hex`](Hex.md), [`Filter`](Filter.md)\>

### getImpersonatedAccount

> `readonly` **getImpersonatedAccount**: () => [`Address`](Address.md) \| `undefined`

The currently impersonated account. This is only used in `fork` mode

#### Returns

[`Address`](Address.md) \| `undefined`

### getLightSyncStatus

> `readonly` **getLightSyncStatus**: () => `Readonly`\<`LightSyncStatus`\>

#### Returns

`Readonly`\<`LightSyncStatus`\>

### getMinGasPrice

> `readonly` **getMinGasPrice**: () => `bigint` \| `undefined`

Gets the minimum gas price for transactions
If undefined, no minimum gas price is enforced

#### Returns

`bigint` \| `undefined`

### getNextBlockBaseFeePerGas

> `readonly` **getNextBlockBaseFeePerGas**: () => `bigint` \| `undefined`

Gets the base fee per gas to use for the next block
If undefined, the base fee will be calculated from the parent block

#### Returns

`bigint` \| `undefined`

### getNextBlockGasLimit

> `readonly` **getNextBlockGasLimit**: () => `bigint` \| `undefined`

Gets the gas limit to use for subsequent blocks
If undefined, the parent block's gas limit will be used

#### Returns

`bigint` \| `undefined`

### getNextBlockPrevRandao

> `readonly` **getNextBlockPrevRandao**: () => `bigint` \| `undefined`

Gets the prevRandao to use for the next block
If undefined, the parent block's mixHash will be used

#### Returns

`bigint` \| `undefined`

### getNextBlockTimestamp

> `readonly` **getNextBlockTimestamp**: () => `bigint` \| `undefined`

Gets the timestamp to use for the next block
If undefined, the current time will be used

#### Returns

`bigint` \| `undefined`

### getReceiptsManager

> `readonly` **getReceiptsManager**: () => `Promise`\<[`ReceiptsManager`](../../receipt-manager/classes/ReceiptsManager.md)\>

Interface for querying receipts and historical state

#### Returns

`Promise`\<[`ReceiptsManager`](../../receipt-manager/classes/ReceiptsManager.md)\>

### getSnapshot

> `readonly` **getSnapshot**: (`snapshotId`) => [`TevmSnapshot`](../../node/type-aliases/TevmSnapshot.md) \| `undefined`

Gets a snapshot by ID
Used by evm_revert RPC method

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `snapshotId` | `string` |

#### Returns

[`TevmSnapshot`](../../node/type-aliases/TevmSnapshot.md) \| `undefined`

### getSnapshots

> `readonly` **getSnapshots**: () => `Map`\<`string`, [`TevmSnapshot`](../../node/type-aliases/TevmSnapshot.md)\>

Gets all stored snapshots for evm_snapshot/evm_revert

#### Returns

`Map`\<`string`, [`TevmSnapshot`](../../node/type-aliases/TevmSnapshot.md)\>

### getTracesEnabled

> `readonly` **getTracesEnabled**: () => `boolean`

Gets whether automatic tracing is enabled.
When enabled, all transactions include traces in their responses.

#### Returns

`boolean`

### getTxPool

> `readonly` **getTxPool**: () => `Promise`\<[`TxPool`](../../txpool/classes/TxPool.md)\>

Gets the pool of pending transactions to be included in next block

#### Returns

`Promise`\<[`TxPool`](../../txpool/classes/TxPool.md)\>

### getVm

> `readonly` **getVm**: () => `Promise`\<[`Vm`](../../vm/type-aliases/Vm.md)\>

Internal instance of the VM. Can be used for lower level operations.
Normally not recomended to use unless building libraries or extensions
on top of Tevm.

#### Returns

`Promise`\<[`Vm`](../../vm/type-aliases/Vm.md)\>

### logger

> `readonly` **logger**: `Logger`

The logger instance

### miningConfig

> **miningConfig**: [`MiningConfig`](MiningConfig.md)

The configuration for mining. Defaults to 'auto'
- 'auto' will mine a block on every transaction
- 'interval' will mine a block every `interval` seconds
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

### ready

> `readonly` **ready**: () => `Promise`\<`true`\>

Returns promise that resulves when the client is ready
The client is usable without calling this method but may
have extra latency on the first call from initialization

#### Returns

`Promise`\<`true`\>

#### Example

```ts
const client = createMemoryClient()
await client.ready()
```

### registerExExHook

> `readonly` **registerExExHook**: (`hook`) => () => `void`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `hook` | [`ExExHook`](../../node/type-aliases/ExExHook.md) |

#### Returns

() => `void`

### removeFilter

> `readonly` **removeFilter**: (`id`) => `void`

Removes a filter by id

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | [`Hex`](Hex.md) |

#### Returns

`void`

### setAutoImpersonate

> `readonly` **setAutoImpersonate**: (`enabled`) => `void`

Sets whether to automatically impersonate all transaction senders.
When enabled, all transactions will have their sender automatically impersonated.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `enabled` | `boolean` |

#### Returns

`void`

### setBlockTimestampInterval

> `readonly` **setBlockTimestampInterval**: (`interval`) => `void`

Sets the automatic timestamp interval to add between blocks.
This is used by the anvil_setBlockTimestampInterval RPC method.
Pass undefined to clear the interval.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `interval` | `bigint` \| `undefined` |

#### Returns

`void`

### setFilter

> `readonly` **setFilter**: (`filter`) => `void`

Creates a new filter to watch for logs events and blocks

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `filter` | [`Filter`](Filter.md) |

#### Returns

`void`

### setImpersonatedAccount

> `readonly` **setImpersonatedAccount**: (`address`) => `void`

Sets the account to impersonate. This will allow the client to act as if it is that account
On Ethereum JSON_RPC endpoints. Pass in undefined to stop impersonating

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | [`Address`](Address.md) \| `undefined` |

#### Returns

`void`

### setMinGasPrice

> `readonly` **setMinGasPrice**: (`minGasPrice`) => `void`

Sets the minimum gas price for transactions.
Transactions with a gas price below this value will be rejected.
This is used by the anvil_setMinGasPrice RPC method.
Pass undefined to clear the minimum.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `minGasPrice` | `bigint` \| `undefined` |

#### Returns

`void`

### setMiningConfig

> `readonly` **setMiningConfig**: (`config`) => `void`

Updates the mining configuration and handles any necessary state changes.
This method properly starts/stops interval mining as needed.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`MiningConfig`](MiningConfig.md) | The new mining configuration |

#### Returns

`void`

#### Example

```ts
const client = createTevmNode()

// Switch to interval mining
client.setMiningConfig({ type: 'interval', blockTime: 5 })

// Switch to manual mining
client.setMiningConfig({ type: 'manual' })
```

### setNextBlockBaseFeePerGas

> `readonly` **setNextBlockBaseFeePerGas**: (`baseFeePerGas`) => `void`

Sets the base fee per gas for the next block (EIP-1559).
This only affects the immediate next block, then is cleared.
This is used by the anvil_setNextBlockBaseFeePerGas RPC method.
Pass undefined to clear the override.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `baseFeePerGas` | `bigint` \| `undefined` |

#### Returns

`void`

### setNextBlockGasLimit

> `readonly` **setNextBlockGasLimit**: (`gasLimit`) => `void`

Sets the gas limit for subsequent blocks.
Unlike setNextBlockTimestamp, this persists across blocks.
This is used by the anvil/evm_setBlockGasLimit RPC method.
Pass undefined to clear the override and use parent block's gas limit.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `gasLimit` | `bigint` \| `undefined` |

#### Returns

`void`

### setNextBlockPrevRandao

> `readonly` **setNextBlockPrevRandao**: (`prevRandao`) => `void`

Sets the prevRandao for the next block.
This only affects the immediate next block, then is cleared.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `prevRandao` | `bigint` \| `undefined` |

#### Returns

`void`

### setNextBlockTimestamp

> `readonly` **setNextBlockTimestamp**: (`timestamp`) => `void`

Sets the timestamp for the next block.
This is used by the anvil/evm_setNextBlockTimestamp RPC method.
Pass undefined to clear the override and use current time.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `timestamp` | `bigint` \| `undefined` |

#### Returns

`void`

### setTracesEnabled

> `readonly` **setTracesEnabled**: (`enabled`) => `void`

Sets whether to automatically collect traces for all transactions.
When enabled, all executed transactions include traces in their responses.
Note: This has performance and memory overhead.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `enabled` | `boolean` |

#### Returns

`void`

### status

> **status**: `"INITIALIZING"` \| `"READY"` \| `"SYNCING"` \| `"MINING"` \| `"STOPPED"`

Returns status of the client
- INITIALIZING: The client is initializing
- READY: The client is ready to be used
- SYNCING: The client is syncing with the forked node
- MINING: The client is mining a block

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TMode` *extends* `"fork"` \| `"normal"` | `"fork"` \| `"normal"` |
| `TExtended` | `object` |
