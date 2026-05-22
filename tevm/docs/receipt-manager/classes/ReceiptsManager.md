[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [receipt-manager](../README.md) / ReceiptsManager

# Class: ReceiptsManager

Manages transaction receipts within the Ethereum virtual machine
Provides methods for storing, retrieving, and searching transaction receipts and logs

## Constructors

### Constructor

> **new ReceiptsManager**(`mapDb`, `chain`): `ReceiptsManager`

Creates a new ReceiptsManager instance

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mapDb` | [`MapDb`](../type-aliases/MapDb.md) | The database instance for storing receipts and indexes |
| `chain` | [`Chain`](../../blockchain/type-aliases/Chain.md) | The blockchain instance for retrieving blocks |

#### Returns

`ReceiptsManager`

## Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="chain"></a> `chain` | `readonly` | [`Chain`](../../blockchain/type-aliases/Chain.md) | - |
| <a id="get_logs_block_range_limit"></a> `GET_LOGS_BLOCK_RANGE_LIMIT` | `public` | `number` | Maximum block range that can be queried in a single getLogs call This prevents excessive computational load from large queries |
| <a id="get_logs_limit"></a> `GET_LOGS_LIMIT` | `public` | `number` | Maximum number of logs to return in getLogs This prevents excessive memory usage and response size |
| <a id="get_logs_limit_megabytes"></a> `GET_LOGS_LIMIT_MEGABYTES` | `public` | `number` | Maximum size of getLogs response in megabytes This prevents excessive memory usage and response size |
| <a id="mapdb"></a> `mapDb` | `readonly` | [`MapDb`](../type-aliases/MapDb.md) | - |

## Methods

### deepCopy()

> **deepCopy**(`chain`): `ReceiptsManager`

Creates a deep copy of this ReceiptsManager with a new chain reference
Useful for creating a snapshot of the current state

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `chain` | [`Chain`](../../blockchain/type-aliases/Chain.md) | The new chain reference to use |

#### Returns

`ReceiptsManager`

A new ReceiptsManager instance with copied state

***

### deleteReceipts()

> **deleteReceipts**(`block`): `Promise`\<`void`\>

Deletes transaction receipts and their indexes for a given block
Used when removing or replacing block data

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `block` | [`Block`](../../block/classes/Block.md) | The block whose receipts should be deleted |

#### Returns

`Promise`\<`void`\>

Promise that resolves when deletion is complete

#### Example

```ts
const block = await chain.getBlock(blockNumber)
await receiptManager.deleteReceipts(block)
```

***

### getLogs()

> **getLogs**(`from`, `to`, `addresses?`, `topics?`): `Promise`\<`GetLogsReturn`\>

Retrieves logs matching the specified criteria within a block range
Implements the core functionality of eth_getLogs JSON-RPC method
Enforces size and count limits to prevent excessive resource usage

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `from` | [`Block`](../../block/classes/Block.md) | The starting block |
| `to` | [`Block`](../../block/classes/Block.md) | The ending block |
| `addresses?` | `Uint8Array`\<`ArrayBufferLike`\>[] | Optional array of addresses to filter logs by |
| `topics?` | (`Uint8Array`\<`ArrayBufferLike`\> \| `Uint8Array`\<`ArrayBufferLike`\>[] \| `null`)[] | Optional array of topics to filter logs by, can include arrays and nulls |

#### Returns

`Promise`\<`GetLogsReturn`\>

Promise resolving to array of matching logs with metadata

#### Example

```ts
// Get all logs between blocks 100 and 200
const logs = await receiptManager.getLogs(block100, block200)

// Get logs from a specific contract
const logs = await receiptManager.getLogs(block100, block200, [contractAddress])

// Get logs with specific topics
const logs = await receiptManager.getLogs(block100, block200, undefined, [eventTopic])
```

***

### getReceiptByTxHash()

> **getReceiptByTxHash**(`txHash`): `Promise`\<`GetReceiptByTxHashReturn` \| `null`\>

Retrieves a transaction receipt by transaction hash
Also returns additional metadata needed for JSON-RPC responses

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `txHash` | `Uint8Array` | The transaction hash to look up |

#### Returns

`Promise`\<`GetReceiptByTxHashReturn` \| `null`\>

Promise resolving to receipt data or null if not found

#### Example

```ts
const receiptData = await receiptManager.getReceiptByTxHash(txHash)
if (receiptData) {
  const [receipt, blockHash, txIndex, logIndex] = receiptData
  // Use receipt data
}
```

***

### getReceipts()

#### Call Signature

> **getReceipts**(`blockHash`, `calcBloom?`, `includeTxType?`): `Promise`\<[`TxReceiptWithType`](../type-aliases/TxReceiptWithType.md)[]\>

Retrieves transaction receipts for a given block hash
Can optionally calculate bloom filters and include transaction types

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `blockHash` | `Uint8Array` | The hash of the block to get receipts for |
| `calcBloom?` | `boolean` | Whether to calculate and include bloom filters (default: false) |
| `includeTxType?` | `true` | Whether to include transaction types in the receipts (default: false) |

##### Returns

`Promise`\<[`TxReceiptWithType`](../type-aliases/TxReceiptWithType.md)[]\>

Promise resolving to an array of transaction receipts

##### Example

```ts
// Get basic receipts
const receipts = await receiptManager.getReceipts(blockHash)

// Get receipts with bloom filters and transaction types
const receiptsWithDetails = await receiptManager.getReceipts(blockHash, true, true)
```

#### Call Signature

> **getReceipts**(`blockHash`, `calcBloom?`, `includeTxType?`): `Promise`\<[`TxReceipt`](../type-aliases/TxReceipt.md)[]\>

Retrieves transaction receipts for a given block hash
Can optionally calculate bloom filters and include transaction types

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `blockHash` | `Uint8Array` | The hash of the block to get receipts for |
| `calcBloom?` | `boolean` | Whether to calculate and include bloom filters (default: false) |
| `includeTxType?` | `false` | Whether to include transaction types in the receipts (default: false) |

##### Returns

`Promise`\<[`TxReceipt`](../type-aliases/TxReceipt.md)[]\>

Promise resolving to an array of transaction receipts

##### Example

```ts
// Get basic receipts
const receipts = await receiptManager.getReceipts(blockHash)

// Get receipts with bloom filters and transaction types
const receiptsWithDetails = await receiptManager.getReceipts(blockHash, true, true)
```

***

### saveReceipts()

> **saveReceipts**(`block`, `receipts`): `Promise`\<`void`\>

Saves transaction receipts to the database for a given block
Also builds and saves transaction hash indexes for efficient lookups

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `block` | [`Block`](../../block/classes/Block.md) | The block containing the transactions |
| `receipts` | [`TxReceipt`](../type-aliases/TxReceipt.md)[] | The transaction receipts to save |

#### Returns

`Promise`\<`void`\>

Promise that resolves when saving is complete

#### Example

```ts
const block = await chain.getBlock(blockNumber)
await receiptManager.saveReceipts(block, txReceipts)
```
