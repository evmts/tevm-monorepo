---
editUrl: false
next: false
prev: false
title: "ReceiptsManager"
---

## Constructors

### new ReceiptsManager()

> **new ReceiptsManager**(`mapDb`, `chain`): [`ReceiptsManager`](/reference/tevm/receipt-manager/classes/receiptsmanager/)

#### Parameters

• **mapDb**: [`MapDb`](/reference/tevm/receipt-manager/type-aliases/mapdb/)

• **chain**: [`Chain`](/reference/tevm/blockchain/type-aliases/chain/)

#### Returns

[`ReceiptsManager`](/reference/tevm/receipt-manager/classes/receiptsmanager/)

#### Source

[RecieptManager.ts:125](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L125)

## Properties

### GET\_LOGS\_BLOCK\_RANGE\_LIMIT

> **GET\_LOGS\_BLOCK\_RANGE\_LIMIT**: `number` = `2500`

Block range limit for getLogs

#### Source

[RecieptManager.ts:142](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L142)

***

### GET\_LOGS\_LIMIT

> **GET\_LOGS\_LIMIT**: `number` = `10000`

Limit of logs to return in getLogs

#### Source

[RecieptManager.ts:132](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L132)

***

### GET\_LOGS\_LIMIT\_MEGABYTES

> **GET\_LOGS\_LIMIT\_MEGABYTES**: `number` = `150`

Size limit for the getLogs response in megabytes

#### Source

[RecieptManager.ts:137](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L137)

***

### chain

> `readonly` **chain**: [`Chain`](/reference/tevm/blockchain/type-aliases/chain/)

#### Source

[RecieptManager.ts:127](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L127)

***

### mapDb

> `readonly` **mapDb**: [`MapDb`](/reference/tevm/receipt-manager/type-aliases/mapdb/)

#### Source

[RecieptManager.ts:126](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L126)

## Methods

### deleteReceipts()

> **deleteReceipts**(`block`): `Promise`\<`void`\>

#### Parameters

• **block**: [`Block`](/reference/tevm/block/classes/block/)

#### Returns

`Promise`\<`void`\>

#### Source

[RecieptManager.ts:156](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L156)

***

### getIndex()

> `private` **getIndex**(`type`, `value`): `Promise`\<`null` \| `TxHashIndex`\>

Returns the value for an index or null if not found

#### Parameters

• **type**: `TxHash`

the IndexType

• **value**: `Uint8Array`

for IndexType.TxHash, the txHash to get

#### Returns

`Promise`\<`null` \| `TxHashIndex`\>

#### Source

[RecieptManager.ts:318](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L318)

***

### getLogs()

> **getLogs**(`from`, `to`, `addresses`?, `topics`?): `Promise`\<`GetLogsReturn`\>

Returns logs as specified by the eth_getLogs JSON RPC query parameters

#### Parameters

• **from**: [`Block`](/reference/tevm/block/classes/block/)

• **to**: [`Block`](/reference/tevm/block/classes/block/)

• **addresses?**: `Uint8Array`[]

• **topics?**: (`null` \| `Uint8Array` \| `Uint8Array`[])[]= `[]`

#### Returns

`Promise`\<`GetLogsReturn`\>

#### Source

[RecieptManager.ts:221](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L221)

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

[RecieptManager.ts:200](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L200)

***

### getReceipts()

#### getReceipts(blockHash, calcBloom, includeTxType)

> **getReceipts**(`blockHash`, `calcBloom`?, `includeTxType`?): `Promise`\<[`TxReceiptWithType`](/reference/tevm/receipt-manager/type-aliases/txreceiptwithtype/)[]\>

Returns receipts for given blockHash

##### Parameters

• **blockHash**: `Uint8Array`

the block hash

• **calcBloom?**: `boolean`

whether to calculate and return the logs bloom for each receipt (default: false)

• **includeTxType?**: `true`

whether to include the tx type for each receipt (default: false)

##### Returns

`Promise`\<[`TxReceiptWithType`](/reference/tevm/receipt-manager/type-aliases/txreceiptwithtype/)[]\>

##### Source

[RecieptManager.ts:167](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L167)

#### getReceipts(blockHash, calcBloom, includeTxType)

> **getReceipts**(`blockHash`, `calcBloom`?, `includeTxType`?): `Promise`\<[`TxReceipt`](/reference/tevm/receipt-manager/type-aliases/txreceipt/)[]\>

##### Parameters

• **blockHash**: `Uint8Array`

• **calcBloom?**: `boolean`

• **includeTxType?**: `false`

##### Returns

`Promise`\<[`TxReceipt`](/reference/tevm/receipt-manager/type-aliases/txreceipt/)[]\>

##### Source

[RecieptManager.ts:168](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L168)

***

### logsBloom()

> `private` **logsBloom**(`logs`): [`Bloom`](/reference/tevm/utils/classes/bloom/)

Returns the logs bloom for a receipt's logs

#### Parameters

• **logs**: [`EthjsLog`](/reference/tevm/utils/type-aliases/ethjslog/)[]

#### Returns

[`Bloom`](/reference/tevm/utils/classes/bloom/)

#### Source

[RecieptManager.ts:399](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L399)

***

### rlp()

#### rlp(conversion, type, value)

> `private` **rlp**(`conversion`, `type`, `value`): `Uint8Array`

Rlp encodes or decodes the specified data type for storage or retrieval from the metaDB

##### Parameters

• **conversion**: `Encode`

RlpConvert.Encode or RlpConvert.Decode

• **type**: `RlpType`

one of RlpType

• **value**: `rlpOut`

the value to encode or decode

##### Returns

`Uint8Array`

##### Source

[RecieptManager.ts:337](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L337)

#### rlp(conversion, type, values)

> `private` **rlp**(`conversion`, `type`, `values`): [`TxReceipt`](/reference/tevm/receipt-manager/type-aliases/txreceipt/)[]

##### Parameters

• **conversion**: `Decode`

• **type**: `Receipts`

• **values**: `Uint8Array`

##### Returns

[`TxReceipt`](/reference/tevm/receipt-manager/type-aliases/txreceipt/)[]

##### Source

[RecieptManager.ts:338](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L338)

#### rlp(conversion, type, value)

> `private` **rlp**(`conversion`, `type`, `value`): [`EthjsLog`](/reference/tevm/utils/type-aliases/ethjslog/)[]

##### Parameters

• **conversion**: `Decode`

• **type**: `Logs`

• **value**: [`EthjsLog`](/reference/tevm/utils/type-aliases/ethjslog/)[]

##### Returns

[`EthjsLog`](/reference/tevm/utils/type-aliases/ethjslog/)[]

##### Source

[RecieptManager.ts:339](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L339)

#### rlp(conversion, type, value)

> `private` **rlp**(`conversion`, `type`, `value`): `TxHashIndex`

##### Parameters

• **conversion**: `Decode`

• **type**: `TxHash`

• **value**: `Uint8Array`

##### Returns

`TxHashIndex`

##### Source

[RecieptManager.ts:340](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L340)

***

### saveReceipts()

> **saveReceipts**(`block`, `receipts`): `Promise`\<`void`\>

Saves receipts to db. Also saves tx hash indexes if within txLookupLimit,
and removes tx hash indexes for one block past txLookupLimit.

#### Parameters

• **block**: [`Block`](/reference/tevm/block/classes/block/)

the block to save receipts for

• **receipts**: [`TxReceipt`](/reference/tevm/receipt-manager/type-aliases/txreceipt/)[]

the receipts to save

#### Returns

`Promise`\<`void`\>

#### Source

[RecieptManager.ts:150](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L150)

***

### updateIndex()

> `private` **updateIndex**(`operation`, `type`, `value`): `Promise`\<`void`\>

Saves or deletes an index from the metaDB

#### Parameters

• **operation**: `IndexOperation`

the IndexOperation

• **type**: `TxHash`

the IndexType

• **value**: [`Block`](/reference/tevm/block/classes/block/)

for IndexType.TxHash, the block to save or delete the tx hash indexes for

#### Returns

`Promise`\<`void`\>

#### Source

[RecieptManager.ts:290](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L290)
