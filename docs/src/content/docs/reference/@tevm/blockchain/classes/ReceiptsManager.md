---
editUrl: false
next: false
prev: false
title: "ReceiptsManager"
---

## Extends

- `MetaDBManager`

## Constructors

### new ReceiptsManager(options)

> **new ReceiptsManager**(`options`): [`ReceiptsManager`](/reference/tevm/blockchain/classes/receiptsmanager/)

#### Parameters

• **options**: `MetaDBManagerOptions`

#### Returns

[`ReceiptsManager`](/reference/tevm/blockchain/classes/receiptsmanager/)

#### Inherited from

`MetaDBManager.constructor`

#### Source

[packages/blockchain/src/MetaDbManager.ts:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/MetaDbManager.ts#L53)

## Properties

### GET\_LOGS\_BLOCK\_RANGE\_LIMIT

> **GET\_LOGS\_BLOCK\_RANGE\_LIMIT**: `number` = `2500`

Block range limit for getLogs

#### Source

[packages/blockchain/src/RecieptManager.ts:160](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L160)

***

### GET\_LOGS\_LIMIT

> **GET\_LOGS\_LIMIT**: `number` = `10000`

Limit of logs to return in getLogs

#### Source

[packages/blockchain/src/RecieptManager.ts:150](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L150)

***

### GET\_LOGS\_LIMIT\_MEGABYTES

> **GET\_LOGS\_LIMIT\_MEGABYTES**: `number` = `150`

Size limit for the getLogs response in megabytes

#### Source

[packages/blockchain/src/RecieptManager.ts:155](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L155)

***

### chain

> **`protected`** **chain**: [`Chain`](/reference/tevm/blockchain/classes/chain/)

#### Inherited from

`MetaDBManager.chain`

#### Source

[packages/blockchain/src/MetaDbManager.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/MetaDbManager.ts#L45)

***

### common

> **`protected`** **common**: [`Common`](/reference/common/classes/common/)

#### Inherited from

`MetaDBManager.common`

#### Source

[packages/blockchain/src/MetaDbManager.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/MetaDbManager.ts#L46)

## Methods

### delete()

> **delete**(`type`, `hash`): `Promise`\<`void`\>

#### Parameters

• **type**: `DBKey`

• **hash**: `Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`MetaDBManager.delete`

#### Source

[packages/blockchain/src/MetaDbManager.ts:79](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/MetaDbManager.ts#L79)

***

### deleteReceipts()

> **deleteReceipts**(`block`): `Promise`\<`void`\>

#### Parameters

• **block**: `Block`

#### Returns

`Promise`\<`void`\>

#### Source

[packages/blockchain/src/RecieptManager.ts:174](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L174)

***

### get()

> **get**(`type`, `hash`): `Promise`\<`null` \| `Uint8Array`\>

#### Parameters

• **type**: `DBKey`

• **hash**: `Uint8Array`

#### Returns

`Promise`\<`null` \| `Uint8Array`\>

#### Inherited from

`MetaDBManager.get`

#### Source

[packages/blockchain/src/MetaDbManager.ts:68](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/MetaDbManager.ts#L68)

***

### getIndex()

> **`private`** **getIndex**(`type`, `value`): `Promise`\<`null` \| `TxHashIndex`\>

Returns the value for an index or null if not found

#### Parameters

• **type**: `TxHash`

the IndexType

• **value**: `Uint8Array`

for IndexType.TxHash, the txHash to get

#### Returns

`Promise`\<`null` \| `TxHashIndex`\>

#### Source

[packages/blockchain/src/RecieptManager.ts:362](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L362)

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

[packages/blockchain/src/RecieptManager.ts:249](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L249)

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

[packages/blockchain/src/RecieptManager.ts:226](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L226)

***

### getReceipts()

#### getReceipts(blockHash, calcBloom, includeTxType)

> **getReceipts**(`blockHash`, `calcBloom`?, `includeTxType`?): `Promise`\<`TxReceiptWithType`[]\>

Returns receipts for given blockHash

##### Parameters

• **blockHash**: `Uint8Array`

the block hash

• **calcBloom?**: `boolean`

whether to calculate and return the logs bloom for each receipt (default: false)

• **includeTxType?**: `true`

whether to include the tx type for each receipt (default: false)

##### Returns

`Promise`\<`TxReceiptWithType`[]\>

##### Source

[packages/blockchain/src/RecieptManager.ts:185](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L185)

#### getReceipts(blockHash, calcBloom, includeTxType)

> **getReceipts**(`blockHash`, `calcBloom`?, `includeTxType`?): `Promise`\<`TxReceipt`[]\>

##### Parameters

• **blockHash**: `Uint8Array`

• **calcBloom?**: `boolean`

• **includeTxType?**: `false`

##### Returns

`Promise`\<`TxReceipt`[]\>

##### Source

[packages/blockchain/src/RecieptManager.ts:190](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L190)

***

### logsBloom()

> **`private`** **logsBloom**(`logs`): [`Bloom`](/reference/utils/classes/bloom/)

Returns the logs bloom for a receipt's logs

#### Parameters

• **logs**: [`EthjsLog`](/reference/utils/type-aliases/ethjslog/)[]

#### Returns

[`Bloom`](/reference/utils/classes/bloom/)

#### Source

[packages/blockchain/src/RecieptManager.ts:475](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L475)

***

### put()

> **put**(`type`, `hash`, `value`): `Promise`\<`void`\>

#### Parameters

• **type**: `DBKey`

• **hash**: `Uint8Array`

• **value**: `Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`MetaDBManager.put`

#### Source

[packages/blockchain/src/MetaDbManager.ts:64](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/MetaDbManager.ts#L64)

***

### rlp()

#### rlp(conversion, type, value)

> **`private`** **rlp**(`conversion`, `type`, `value`): `Uint8Array`

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

[packages/blockchain/src/RecieptManager.ts:387](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L387)

#### rlp(conversion, type, values)

> **`private`** **rlp**(`conversion`, `type`, `values`): `TxReceipt`[]

##### Parameters

• **conversion**: `Decode`

• **type**: `Receipts`

• **values**: `Uint8Array`

##### Returns

`TxReceipt`[]

##### Source

[packages/blockchain/src/RecieptManager.ts:392](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L392)

#### rlp(conversion, type, value)

> **`private`** **rlp**(`conversion`, `type`, `value`): [`EthjsLog`](/reference/utils/type-aliases/ethjslog/)[]

##### Parameters

• **conversion**: `Decode`

• **type**: `Logs`

• **value**: [`EthjsLog`](/reference/utils/type-aliases/ethjslog/)[]

##### Returns

[`EthjsLog`](/reference/utils/type-aliases/ethjslog/)[]

##### Source

[packages/blockchain/src/RecieptManager.ts:397](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L397)

#### rlp(conversion, type, value)

> **`private`** **rlp**(`conversion`, `type`, `value`): `TxHashIndex`

##### Parameters

• **conversion**: `Decode`

• **type**: `TxHash`

• **value**: `Uint8Array`

##### Returns

`TxHashIndex`

##### Source

[packages/blockchain/src/RecieptManager.ts:402](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L402)

***

### saveReceipts()

> **saveReceipts**(`block`, `receipts`): `Promise`\<`void`\>

Saves receipts to db. Also saves tx hash indexes if within txLookupLimit,
and removes tx hash indexes for one block past txLookupLimit.

#### Parameters

• **block**: `Block`

the block to save receipts for

• **receipts**: `TxReceipt`[]

the receipts to save

#### Returns

`Promise`\<`void`\>

#### Source

[packages/blockchain/src/RecieptManager.ts:168](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L168)

***

### updateIndex()

> **`private`** **updateIndex**(`operation`, `type`, `value`): `Promise`\<`void`\>

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

[packages/blockchain/src/RecieptManager.ts:326](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L326)
