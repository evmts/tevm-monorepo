**@tevm/blockchain** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ReceiptsManager

# Class: ReceiptsManager

## Extends

- `MetaDBManager`

## Constructors

### new ReceiptsManager(options)

> **new ReceiptsManager**(`options`): [`ReceiptsManager`](ReceiptsManager.md)

#### Parameters

▪ **options**: `MetaDBManagerOptions`

#### Inherited from

MetaDBManager.constructor

#### Source

[packages/blockchain/src/MetaDbManager.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/MetaDbManager.ts#L45)

## Properties

### GET\_LOGS\_BLOCK\_RANGE\_LIMIT

> **GET\_LOGS\_BLOCK\_RANGE\_LIMIT**: `number` = `2500`

Block range limit for getLogs

#### Source

[packages/blockchain/src/RecieptManager.ts:138](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L138)

***

### GET\_LOGS\_LIMIT

> **GET\_LOGS\_LIMIT**: `number` = `10000`

Limit of logs to return in getLogs

#### Source

[packages/blockchain/src/RecieptManager.ts:128](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L128)

***

### GET\_LOGS\_LIMIT\_MEGABYTES

> **GET\_LOGS\_LIMIT\_MEGABYTES**: `number` = `150`

Size limit for the getLogs response in megabytes

#### Source

[packages/blockchain/src/RecieptManager.ts:133](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L133)

***

### chain

> **`protected`** **chain**: [`Chain`](Chain.md)

#### Inherited from

MetaDBManager.chain

#### Source

[packages/blockchain/src/MetaDbManager.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/MetaDbManager.ts#L41)

***

### common

> **`protected`** **common**: `Common`

#### Inherited from

MetaDBManager.common

#### Source

[packages/blockchain/src/MetaDbManager.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/MetaDbManager.ts#L42)

## Methods

### delete()

> **delete**(`type`, `hash`): `Promise`\<`void`\>

#### Parameters

▪ **type**: `DBKey`

▪ **hash**: `Uint8Array`

#### Inherited from

MetaDBManager.delete

#### Source

[packages/blockchain/src/MetaDbManager.ts:71](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/MetaDbManager.ts#L71)

***

### deleteReceipts()

> **deleteReceipts**(`block`): `Promise`\<`void`\>

#### Parameters

▪ **block**: `Block`

#### Source

[packages/blockchain/src/RecieptManager.ts:152](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L152)

***

### get()

> **get**(`type`, `hash`): `Promise`\<`null` \| `Uint8Array`\>

#### Parameters

▪ **type**: `DBKey`

▪ **hash**: `Uint8Array`

#### Inherited from

MetaDBManager.get

#### Source

[packages/blockchain/src/MetaDbManager.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/MetaDbManager.ts#L60)

***

### getIndex()

> **`private`** **getIndex**(`type`, `value`): `Promise`\<`null` \| `TxHashIndex`\>

Returns the value for an index or null if not found

#### Parameters

▪ **type**: `TxHash`

the [IndexType]([object Object])

▪ **value**: `Uint8Array`

for [IndexType.TxHash]([object Object]), the txHash to get

#### Source

[packages/blockchain/src/RecieptManager.ts:314](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L314)

***

### getLogs()

> **getLogs**(`from`, `to`, `addresses`?, `topics`?): `Promise`\<`GetLogsReturn`\>

Returns logs as specified by the eth_getLogs JSON RPC query parameters

#### Parameters

▪ **from**: `Block`

▪ **to**: `Block`

▪ **addresses?**: `Uint8Array`[]

▪ **topics?**: (`null` \| `Uint8Array` \| `Uint8Array`[])[]= `[]`

#### Source

[packages/blockchain/src/RecieptManager.ts:217](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L217)

***

### getReceiptByTxHash()

> **getReceiptByTxHash**(`txHash`): `Promise`\<`null` \| `GetReceiptByTxHashReturn`\>

Returns receipt by tx hash with additional metadata for the JSON RPC response, or null if not found

#### Parameters

▪ **txHash**: `Uint8Array`

the tx hash

#### Source

[packages/blockchain/src/RecieptManager.ts:196](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L196)

***

### getReceipts()

#### getReceipts(blockHash, calcBloom, includeTxType)

> **getReceipts**(`blockHash`, `calcBloom`?, `includeTxType`?): `Promise`\<`TxReceiptWithType`[]\>

Returns receipts for given blockHash

##### Parameters

▪ **blockHash**: `Uint8Array`

the block hash

▪ **calcBloom?**: `boolean`

whether to calculate and return the logs bloom for each receipt (default: false)

▪ **includeTxType?**: `true`

whether to include the tx type for each receipt (default: false)

##### Source

[packages/blockchain/src/RecieptManager.ts:163](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L163)

#### getReceipts(blockHash, calcBloom, includeTxType)

> **getReceipts**(`blockHash`, `calcBloom`?, `includeTxType`?): `Promise`\<`TxReceipt`[]\>

##### Parameters

▪ **blockHash**: `Uint8Array`

▪ **calcBloom?**: `boolean`

▪ **includeTxType?**: `false`

##### Source

[packages/blockchain/src/RecieptManager.ts:164](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L164)

***

### logsBloom()

> **`private`** **logsBloom**(`logs`): `Bloom`

Returns the logs bloom for a receipt's logs

#### Parameters

▪ **logs**: `Log`[]

#### Source

[packages/blockchain/src/RecieptManager.ts:395](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L395)

***

### put()

> **put**(`type`, `hash`, `value`): `Promise`\<`void`\>

#### Parameters

▪ **type**: `DBKey`

▪ **hash**: `Uint8Array`

▪ **value**: `Uint8Array`

#### Inherited from

MetaDBManager.put

#### Source

[packages/blockchain/src/MetaDbManager.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/MetaDbManager.ts#L56)

***

### rlp()

#### rlp(conversion, type, value)

> **`private`** **rlp**(`conversion`, `type`, `value`): `Uint8Array`

Rlp encodes or decodes the specified data type for storage or retrieval from the metaDB

##### Parameters

▪ **conversion**: `Encode`

[RlpConvert.Encode]([object Object]) or [RlpConvert.Decode]([object Object])

▪ **type**: `RlpType`

one of [RlpType]([object Object])

▪ **value**: `rlpOut`

the value to encode or decode

##### Source

[packages/blockchain/src/RecieptManager.ts:333](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L333)

#### rlp(conversion, type, values)

> **`private`** **rlp**(`conversion`, `type`, `values`): `TxReceipt`[]

##### Parameters

▪ **conversion**: `Decode`

▪ **type**: `Receipts`

▪ **values**: `Uint8Array`

##### Source

[packages/blockchain/src/RecieptManager.ts:334](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L334)

#### rlp(conversion, type, value)

> **`private`** **rlp**(`conversion`, `type`, `value`): `Log`[]

##### Parameters

▪ **conversion**: `Decode`

▪ **type**: `Logs`

▪ **value**: `Log`[]

##### Source

[packages/blockchain/src/RecieptManager.ts:335](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L335)

#### rlp(conversion, type, value)

> **`private`** **rlp**(`conversion`, `type`, `value`): `TxHashIndex`

##### Parameters

▪ **conversion**: `Decode`

▪ **type**: `TxHash`

▪ **value**: `Uint8Array`

##### Source

[packages/blockchain/src/RecieptManager.ts:336](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L336)

***

### saveReceipts()

> **saveReceipts**(`block`, `receipts`): `Promise`\<`void`\>

Saves receipts to db. Also saves tx hash indexes if within txLookupLimit,
and removes tx hash indexes for one block past txLookupLimit.

#### Parameters

▪ **block**: `Block`

the block to save receipts for

▪ **receipts**: `TxReceipt`[]

the receipts to save

#### Source

[packages/blockchain/src/RecieptManager.ts:146](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L146)

***

### updateIndex()

> **`private`** **updateIndex**(`operation`, `type`, `value`): `Promise`\<`void`\>

Saves or deletes an index from the metaDB

#### Parameters

▪ **operation**: `IndexOperation`

the [IndexOperation]([object Object])

▪ **type**: `TxHash`

the [IndexType]([object Object])

▪ **value**: `Block`

for [IndexType.TxHash]([object Object]), the block to save or delete the tx hash indexes for

#### Source

[packages/blockchain/src/RecieptManager.ts:286](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L286)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
