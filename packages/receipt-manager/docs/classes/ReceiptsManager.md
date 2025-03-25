[**@tevm/receipt-manager**](../README.md)

***

[@tevm/receipt-manager](../globals.md) / ReceiptsManager

# Class: ReceiptsManager

Defined in: [ReceiptManager.ts:213](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L213)

Manages transaction receipts within the Ethereum virtual machine
Provides methods for storing, retrieving, and searching transaction receipts and logs

## Constructors

### new ReceiptsManager()

> **new ReceiptsManager**(`mapDb`, `chain`): `ReceiptsManager`

Defined in: [ReceiptManager.ts:219](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L219)

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

Defined in: [ReceiptManager.ts:221](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L221)

The blockchain instance for retrieving blocks

***

### GET\_LOGS\_BLOCK\_RANGE\_LIMIT

> **GET\_LOGS\_BLOCK\_RANGE\_LIMIT**: `number` = `2500`

Defined in: [ReceiptManager.ts:240](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L240)

Maximum block range that can be queried in a single getLogs call
This prevents excessive computational load from large queries

***

### GET\_LOGS\_LIMIT

> **GET\_LOGS\_LIMIT**: `number` = `10000`

Defined in: [ReceiptManager.ts:228](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L228)

Maximum number of logs to return in getLogs
This prevents excessive memory usage and response size

***

### GET\_LOGS\_LIMIT\_MEGABYTES

> **GET\_LOGS\_LIMIT\_MEGABYTES**: `number` = `150`

Defined in: [ReceiptManager.ts:234](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L234)

Maximum size of getLogs response in megabytes
This prevents excessive memory usage and response size

***

### mapDb

> `readonly` **mapDb**: [`MapDb`](../type-aliases/MapDb.md)

Defined in: [ReceiptManager.ts:220](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L220)

The database instance for storing receipts and indexes

## Methods

### deepCopy()

> **deepCopy**(`chain`): `ReceiptsManager`

Defined in: [ReceiptManager.ts:249](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L249)

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

Defined in: [ReceiptManager.ts:282](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L282)

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

> **getLogs**(`from`, `to`, `addresses`?, `topics`?): `Promise`\<`GetLogsReturn`\>

Defined in: [ReceiptManager.ts:385](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L385)

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

(`null` \| `Uint8Array`\<`ArrayBufferLike`\> \| `Uint8Array`\<`ArrayBufferLike`\>[])[] = `[]`

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

> **getReceiptByTxHash**(`txHash`): `Promise`\<`null` \| `GetReceiptByTxHashReturn`\>

Defined in: [ReceiptManager.ts:346](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L346)

Retrieves a transaction receipt by transaction hash
Also returns additional metadata needed for JSON-RPC responses

#### Parameters

##### txHash

`Uint8Array`

The transaction hash to look up

#### Returns

`Promise`\<`null` \| `GetReceiptByTxHashReturn`\>

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

> **getReceipts**(`blockHash`, `calcBloom`?, `includeTxType`?): `Promise`\<[`TxReceiptWithType`](../type-aliases/TxReceiptWithType.md)[]\>

Defined in: [ReceiptManager.ts:303](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L303)

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

> **getReceipts**(`blockHash`, `calcBloom`?, `includeTxType`?): `Promise`\<[`TxReceipt`](../type-aliases/TxReceipt.md)[]\>

Defined in: [ReceiptManager.ts:304](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L304)

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

Defined in: [ReceiptManager.ts:265](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/ReceiptManager.ts#L265)

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
