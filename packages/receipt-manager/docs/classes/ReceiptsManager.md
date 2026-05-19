[**@tevm/receipt-manager**](../README.md)

***

[@tevm/receipt-manager](../globals.md) / ReceiptsManager

# Class: ReceiptsManager

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:212](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L212)

Manages transaction receipts within the Ethereum virtual machine
Provides methods for storing, retrieving, and searching transaction receipts and logs

## Constructors

### Constructor

> **new ReceiptsManager**(`mapDb`, `chain`): `ReceiptsManager`

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:218](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L218)

Creates a new ReceiptsManager instance

#### Parameters

##### mapDb

[`MapDb`](../type-aliases/MapDb.md)

The database instance for storing receipts and indexes

##### chain

`Chain`

The blockchain instance for retrieving blocks

#### Returns

`ReceiptsManager`

## Properties

### chain

> `readonly` **chain**: `Chain`

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:220](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L220)

The blockchain instance for retrieving blocks

***

### GET\_LOGS\_BLOCK\_RANGE\_LIMIT

> **GET\_LOGS\_BLOCK\_RANGE\_LIMIT**: `number` = `2500`

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:239](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L239)

Maximum block range that can be queried in a single getLogs call
This prevents excessive computational load from large queries

***

### GET\_LOGS\_LIMIT

> **GET\_LOGS\_LIMIT**: `number` = `10000`

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:227](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L227)

Maximum number of logs to return in getLogs
This prevents excessive memory usage and response size

***

### GET\_LOGS\_LIMIT\_MEGABYTES

> **GET\_LOGS\_LIMIT\_MEGABYTES**: `number` = `150`

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:233](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L233)

Maximum size of getLogs response in megabytes
This prevents excessive memory usage and response size

***

### mapDb

> `readonly` **mapDb**: [`MapDb`](../type-aliases/MapDb.md)

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:219](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L219)

The database instance for storing receipts and indexes

## Methods

### deepCopy()

> **deepCopy**(`chain`): `ReceiptsManager`

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:248](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L248)

Creates a deep copy of this ReceiptsManager with a new chain reference
Useful for creating a snapshot of the current state

#### Parameters

##### chain

`Chain`

The new chain reference to use

#### Returns

`ReceiptsManager`

A new ReceiptsManager instance with copied state

***

### deleteReceipts()

> **deleteReceipts**(`block`): `Promise`\<`void`\>

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:281](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L281)

Deletes transaction receipts and their indexes for a given block
Used when removing or replacing block data

#### Parameters

##### block

`Block`

The block whose receipts should be deleted

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

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:384](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L384)

Retrieves logs matching the specified criteria within a block range
Implements the core functionality of eth_getLogs JSON-RPC method
Enforces size and count limits to prevent excessive resource usage

#### Parameters

##### from

`Block`

The starting block

##### to

`Block`

The ending block

##### addresses?

`Uint8Array`\<`ArrayBufferLike`\>[]

Optional array of addresses to filter logs by

##### topics?

(`Uint8Array`\<`ArrayBufferLike`\> \| `Uint8Array`\<`ArrayBufferLike`\>[] \| `null`)[] = `[]`

Optional array of topics to filter logs by, can include arrays and nulls

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

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:345](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L345)

Retrieves a transaction receipt by transaction hash
Also returns additional metadata needed for JSON-RPC responses

#### Parameters

##### txHash

`Uint8Array`

The transaction hash to look up

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

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:302](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L302)

Retrieves transaction receipts for a given block hash
Can optionally calculate bloom filters and include transaction types

##### Parameters

###### blockHash

`Uint8Array`

The hash of the block to get receipts for

###### calcBloom?

`boolean`

Whether to calculate and include bloom filters (default: false)

###### includeTxType?

`true`

Whether to include transaction types in the receipts (default: false)

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

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:303](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L303)

Retrieves transaction receipts for a given block hash
Can optionally calculate bloom filters and include transaction types

##### Parameters

###### blockHash

`Uint8Array`

The hash of the block to get receipts for

###### calcBloom?

`boolean`

Whether to calculate and include bloom filters (default: false)

###### includeTxType?

`false`

Whether to include transaction types in the receipts (default: false)

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

Defined in: [tevm-monorepo/packages/receipt-manager/src/ReceiptManager.ts:264](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L264)

Saves transaction receipts to the database for a given block
Also builds and saves transaction hash indexes for efficient lookups

#### Parameters

##### block

`Block`

The block containing the transactions

##### receipts

[`TxReceipt`](../type-aliases/TxReceipt.md)[]

The transaction receipts to save

#### Returns

`Promise`\<`void`\>

Promise that resolves when saving is complete

#### Example

```ts
const block = await chain.getBlock(blockNumber)
await receiptManager.saveReceipts(block, txReceipts)
```
