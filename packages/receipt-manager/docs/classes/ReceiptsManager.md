[**@tevm/receipt-manager**](../README.md) • **Docs**

***

[@tevm/receipt-manager](../globals.md) / ReceiptsManager

# Class: ReceiptsManager

## Constructors

### new ReceiptsManager()

> **new ReceiptsManager**(`mapDb`, `chain`): [`ReceiptsManager`](ReceiptsManager.md)

#### Parameters

• **mapDb**: [`MapDb`](../type-aliases/MapDb.md)

• **chain**: `Chain`

#### Returns

[`ReceiptsManager`](ReceiptsManager.md)

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

> `readonly` **chain**: `Chain`

#### Source

[RecieptManager.ts:127](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L127)

***

### mapDb

> `readonly` **mapDb**: [`MapDb`](../type-aliases/MapDb.md)

#### Source

[RecieptManager.ts:126](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L126)

## Methods

### deleteReceipts()

> **deleteReceipts**(`block`): `Promise`\<`void`\>

#### Parameters

• **block**: `Block`

#### Returns

`Promise`\<`void`\>

#### Source

[RecieptManager.ts:157](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L157)

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

[RecieptManager.ts:321](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L321)

***

### getLogs()

> **getLogs**(`from`, `to`, `addresses`?, `topics`?): `Promise`\<`GetLogsReturn`\>

Returns logs as specified by the eth_getLogs JSON RPC query parameters

#### Parameters

• **from**: `Block`

• **to**: `Block`

• **addresses?**: `Uint8Array`[]

• **topics?**: (`null` \| `Uint8Array` \| `Uint8Array`[])[]= `[]`

#### Returns

`Promise`\<`GetLogsReturn`\>

#### Source

[RecieptManager.ts:224](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L224)

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

[RecieptManager.ts:201](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L201)

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

[RecieptManager.ts:168](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L168)

#### getReceipts(blockHash, calcBloom, includeTxType)

> **getReceipts**(`blockHash`, `calcBloom`?, `includeTxType`?): `Promise`\<[`TxReceipt`](../type-aliases/TxReceipt.md)[]\>

##### Parameters

• **blockHash**: `Uint8Array`

• **calcBloom?**: `boolean`

• **includeTxType?**: `false`

##### Returns

`Promise`\<[`TxReceipt`](../type-aliases/TxReceipt.md)[]\>

##### Source

[RecieptManager.ts:169](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L169)

***

### logsBloom()

> `private` **logsBloom**(`logs`): `Bloom`

Returns the logs bloom for a receipt's logs

#### Parameters

• **logs**: `Log`[]

#### Returns

`Bloom`

#### Source

[RecieptManager.ts:402](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L402)

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

[RecieptManager.ts:340](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L340)

#### rlp(conversion, type, values)

> `private` **rlp**(`conversion`, `type`, `values`): [`TxReceipt`](../type-aliases/TxReceipt.md)[]

##### Parameters

• **conversion**: `Decode`

• **type**: `Receipts`

• **values**: `Uint8Array`

##### Returns

[`TxReceipt`](../type-aliases/TxReceipt.md)[]

##### Source

[RecieptManager.ts:341](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L341)

#### rlp(conversion, type, value)

> `private` **rlp**(`conversion`, `type`, `value`): `Log`[]

##### Parameters

• **conversion**: `Decode`

• **type**: `Logs`

• **value**: `Log`[]

##### Returns

`Log`[]

##### Source

[RecieptManager.ts:342](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L342)

#### rlp(conversion, type, value)

> `private` **rlp**(`conversion`, `type`, `value`): `TxHashIndex`

##### Parameters

• **conversion**: `Decode`

• **type**: `TxHash`

• **value**: `Uint8Array`

##### Returns

`TxHashIndex`

##### Source

[RecieptManager.ts:343](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L343)

***

### saveReceipts()

> **saveReceipts**(`block`, `receipts`): `Promise`\<`void`\>

Saves receipts to db. Also saves tx hash indexes if within txLookupLimit,
and removes tx hash indexes for one block past txLookupLimit.

#### Parameters

• **block**: `Block`

the block to save receipts for

• **receipts**: [`TxReceipt`](../type-aliases/TxReceipt.md)[]

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

• **value**: `Block`

for IndexType.TxHash, the block to save or delete the tx hash indexes for

#### Returns

`Promise`\<`void`\>

#### Source

[RecieptManager.ts:293](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L293)
