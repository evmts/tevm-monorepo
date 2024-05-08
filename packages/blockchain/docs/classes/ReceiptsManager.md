**@tevm/blockchain** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ReceiptsManager

# Class: ReceiptsManager

## Constructors

### new ReceiptsManager(mapDb, chain)

> **new ReceiptsManager**(`mapDb`, `chain`): [`ReceiptsManager`](ReceiptsManager.md)

#### Parameters

▪ **mapDb**: [`MapDb`](../type-aliases/MapDb.md)

▪ **chain**: [`Chain`](../type-aliases/Chain.md)

#### Source

[RecieptManager.ts:126](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L126)

## Properties

### GET\_LOGS\_BLOCK\_RANGE\_LIMIT

> **GET\_LOGS\_BLOCK\_RANGE\_LIMIT**: `number` = `2500`

Block range limit for getLogs

#### Source

[RecieptManager.ts:143](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L143)

***

### GET\_LOGS\_LIMIT

> **GET\_LOGS\_LIMIT**: `number` = `10000`

Limit of logs to return in getLogs

#### Source

[RecieptManager.ts:133](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L133)

***

### GET\_LOGS\_LIMIT\_MEGABYTES

> **GET\_LOGS\_LIMIT\_MEGABYTES**: `number` = `150`

Size limit for the getLogs response in megabytes

#### Source

[RecieptManager.ts:138](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L138)

***

### chain

> **`readonly`** **chain**: [`Chain`](../type-aliases/Chain.md)

#### Source

[RecieptManager.ts:128](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L128)

***

### mapDb

> **`readonly`** **mapDb**: [`MapDb`](../type-aliases/MapDb.md)

#### Source

[RecieptManager.ts:127](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L127)

## Methods

### deleteReceipts()

> **deleteReceipts**(`block`): `Promise`\<`void`\>

#### Parameters

▪ **block**: `Block`

#### Source

[RecieptManager.ts:157](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L157)

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

[RecieptManager.ts:319](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L319)

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

[RecieptManager.ts:222](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L222)

***

### getReceiptByTxHash()

> **getReceiptByTxHash**(`txHash`): `Promise`\<`null` \| `GetReceiptByTxHashReturn`\>

Returns receipt by tx hash with additional metadata for the JSON RPC response, or null if not found

#### Parameters

▪ **txHash**: `Uint8Array`

the tx hash

#### Source

[RecieptManager.ts:201](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L201)

***

### getReceipts()

#### getReceipts(blockHash, calcBloom, includeTxType)

> **getReceipts**(`blockHash`, `calcBloom`?, `includeTxType`?): `Promise`\<[`TxReceiptWithType`](../type-aliases/TxReceiptWithType.md)[]\>

Returns receipts for given blockHash

##### Parameters

▪ **blockHash**: `Uint8Array`

the block hash

▪ **calcBloom?**: `boolean`

whether to calculate and return the logs bloom for each receipt (default: false)

▪ **includeTxType?**: `true`

whether to include the tx type for each receipt (default: false)

##### Source

[RecieptManager.ts:168](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L168)

#### getReceipts(blockHash, calcBloom, includeTxType)

> **getReceipts**(`blockHash`, `calcBloom`?, `includeTxType`?): `Promise`\<[`TxReceipt`](../type-aliases/TxReceipt.md)[]\>

##### Parameters

▪ **blockHash**: `Uint8Array`

▪ **calcBloom?**: `boolean`

▪ **includeTxType?**: `false`

##### Source

[RecieptManager.ts:169](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L169)

***

### logsBloom()

> **`private`** **logsBloom**(`logs`): `Bloom`

Returns the logs bloom for a receipt's logs

#### Parameters

▪ **logs**: `Log`[]

#### Source

[RecieptManager.ts:400](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L400)

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

[RecieptManager.ts:338](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L338)

#### rlp(conversion, type, values)

> **`private`** **rlp**(`conversion`, `type`, `values`): [`TxReceipt`](../type-aliases/TxReceipt.md)[]

##### Parameters

▪ **conversion**: `Decode`

▪ **type**: `Receipts`

▪ **values**: `Uint8Array`

##### Source

[RecieptManager.ts:339](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L339)

#### rlp(conversion, type, value)

> **`private`** **rlp**(`conversion`, `type`, `value`): `Log`[]

##### Parameters

▪ **conversion**: `Decode`

▪ **type**: `Logs`

▪ **value**: `Log`[]

##### Source

[RecieptManager.ts:340](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L340)

#### rlp(conversion, type, value)

> **`private`** **rlp**(`conversion`, `type`, `value`): `TxHashIndex`

##### Parameters

▪ **conversion**: `Decode`

▪ **type**: `TxHash`

▪ **value**: `Uint8Array`

##### Source

[RecieptManager.ts:341](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L341)

***

### saveReceipts()

> **saveReceipts**(`block`, `receipts`): `Promise`\<`void`\>

Saves receipts to db. Also saves tx hash indexes if within txLookupLimit,
and removes tx hash indexes for one block past txLookupLimit.

#### Parameters

▪ **block**: `Block`

the block to save receipts for

▪ **receipts**: [`TxReceipt`](../type-aliases/TxReceipt.md)[]

the receipts to save

#### Source

[RecieptManager.ts:151](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L151)

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

[RecieptManager.ts:291](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L291)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
