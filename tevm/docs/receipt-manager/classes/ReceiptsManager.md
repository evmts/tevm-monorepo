[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [receipt-manager](../README.md) / ReceiptsManager

# Class: ReceiptsManager

## Constructors

### new ReceiptsManager()

> **new ReceiptsManager**(`mapDb`, `chain`): [`ReceiptsManager`](ReceiptsManager.md)

#### Parameters

• **mapDb**: [`MapDb`](../type-aliases/MapDb.md)

• **chain**: [`Chain`](../../blockchain/type-aliases/Chain.md)

#### Returns

[`ReceiptsManager`](ReceiptsManager.md)

#### Source

packages/receipt-manager/types/RecieptManager.d.ts:85

## Properties

### GET\_LOGS\_BLOCK\_RANGE\_LIMIT

> **GET\_LOGS\_BLOCK\_RANGE\_LIMIT**: `number`

Block range limit for getLogs

#### Source

packages/receipt-manager/types/RecieptManager.d.ts:97

***

### GET\_LOGS\_LIMIT

> **GET\_LOGS\_LIMIT**: `number`

Limit of logs to return in getLogs

#### Source

packages/receipt-manager/types/RecieptManager.d.ts:89

***

### GET\_LOGS\_LIMIT\_MEGABYTES

> **GET\_LOGS\_LIMIT\_MEGABYTES**: `number`

Size limit for the getLogs response in megabytes

#### Source

packages/receipt-manager/types/RecieptManager.d.ts:93

***

### chain

> `readonly` **chain**: [`Chain`](../../blockchain/type-aliases/Chain.md)

#### Source

packages/receipt-manager/types/RecieptManager.d.ts:84

***

### getIndex

> `private` **getIndex**: `any`

Returns the value for an index or null if not found

#### Param

the IndexType

#### Param

for IndexType.TxHash, the txHash to get

#### Source

packages/receipt-manager/types/RecieptManager.d.ts:135

***

### logsBloom

> `private` **logsBloom**: `any`

Returns the logs bloom for a receipt's logs

#### Param

#### Source

packages/receipt-manager/types/RecieptManager.d.ts:147

***

### mapDb

> `readonly` **mapDb**: [`MapDb`](../type-aliases/MapDb.md)

#### Source

packages/receipt-manager/types/RecieptManager.d.ts:83

***

### rlp

> `private` **rlp**: `any`

Rlp encodes or decodes the specified data type for storage or retrieval from the metaDB

#### Param

RlpConvert.Encode or RlpConvert.Decode

#### Param

one of RlpType

#### Param

the value to encode or decode

#### Source

packages/receipt-manager/types/RecieptManager.d.ts:142

***

### updateIndex

> `private` **updateIndex**: `any`

Saves or deletes an index from the metaDB

#### Param

the IndexOperation

#### Param

the IndexType

#### Param

for IndexType.TxHash, the block to save or delete the tx hash indexes for

#### Source

packages/receipt-manager/types/RecieptManager.d.ts:129

## Methods

### deleteReceipts()

> **deleteReceipts**(`block`): `Promise`\<`void`\>

#### Parameters

• **block**: [`Block`](../../block/classes/Block.md)

#### Returns

`Promise`\<`void`\>

#### Source

packages/receipt-manager/types/RecieptManager.d.ts:105

***

### getLogs()

> **getLogs**(`from`, `to`, `addresses`?, `topics`?): `Promise`\<`GetLogsReturn`\>

Returns logs as specified by the eth_getLogs JSON RPC query parameters

#### Parameters

• **from**: [`Block`](../../block/classes/Block.md)

• **to**: [`Block`](../../block/classes/Block.md)

• **addresses?**: `Uint8Array`[]

• **topics?**: (`null` \| `Uint8Array` \| `Uint8Array`[])[]

#### Returns

`Promise`\<`GetLogsReturn`\>

#### Source

packages/receipt-manager/types/RecieptManager.d.ts:122

***

### getReceiptByTxHash()

> **getReceiptByTxHash**(`txHash`): `Promise`\<`null` \| `GetReceiptByTxHashReturn`\>

Returns receipt by tx hash with additional metadata for the JSON RPC response, or null if not found

#### Parameters

• **txHash**: `Uint8Array`

the tx hash

#### Returns

`Promise`\<`null` \| `GetReceiptByTxHashReturn`\>

#### Source

packages/receipt-manager/types/RecieptManager.d.ts:118

***

### getReceipts()

#### getReceipts(blockHash, calcBloom, includeTxType)

> **getReceipts**(`blockHash`, `calcBloom`?, `includeTxType`?): `Promise`\<[`TxReceiptWithType`](../type-aliases/TxReceiptWithType.md)[]\>

Returns receipts for given blockHash

##### Parameters

• **blockHash**: `Uint8Array`

the block hash

• **calcBloom?**: `boolean`

whether to calculate and return the logs bloom for each receipt (default: false)

• **includeTxType?**: `true`

whether to include the tx type for each receipt (default: false)

##### Returns

`Promise`\<[`TxReceiptWithType`](../type-aliases/TxReceiptWithType.md)[]\>

##### Source

packages/receipt-manager/types/RecieptManager.d.ts:112

#### getReceipts(blockHash, calcBloom, includeTxType)

> **getReceipts**(`blockHash`, `calcBloom`?, `includeTxType`?): `Promise`\<[`TxReceipt`](../type-aliases/TxReceipt.md)[]\>

##### Parameters

• **blockHash**: `Uint8Array`

• **calcBloom?**: `boolean`

• **includeTxType?**: `false`

##### Returns

`Promise`\<[`TxReceipt`](../type-aliases/TxReceipt.md)[]\>

##### Source

packages/receipt-manager/types/RecieptManager.d.ts:113

***

### saveReceipts()

> **saveReceipts**(`block`, `receipts`): `Promise`\<`void`\>

Saves receipts to db. Also saves tx hash indexes if within txLookupLimit,
and removes tx hash indexes for one block past txLookupLimit.

#### Parameters

• **block**: [`Block`](../../block/classes/Block.md)

the block to save receipts for

• **receipts**: [`TxReceipt`](../type-aliases/TxReceipt.md)[]

the receipts to save

#### Returns

`Promise`\<`void`\>

#### Source

packages/receipt-manager/types/RecieptManager.d.ts:104
