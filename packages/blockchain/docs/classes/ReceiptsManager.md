[@tevm/blockchain](../README.md) / [Exports](../modules.md) / ReceiptsManager

# Class: ReceiptsManager

## Hierarchy

- `MetaDBManager`

  ↳ **`ReceiptsManager`**

## Table of contents

### Constructors

- [constructor](ReceiptsManager.md#constructor)

### Properties

- [GET\_LOGS\_BLOCK\_RANGE\_LIMIT](ReceiptsManager.md#get_logs_block_range_limit)
- [GET\_LOGS\_LIMIT](ReceiptsManager.md#get_logs_limit)
- [GET\_LOGS\_LIMIT\_MEGABYTES](ReceiptsManager.md#get_logs_limit_megabytes)
- [chain](ReceiptsManager.md#chain)
- [common](ReceiptsManager.md#common)

### Methods

- [delete](ReceiptsManager.md#delete)
- [deleteReceipts](ReceiptsManager.md#deletereceipts)
- [get](ReceiptsManager.md#get)
- [getIndex](ReceiptsManager.md#getindex)
- [getLogs](ReceiptsManager.md#getlogs)
- [getReceiptByTxHash](ReceiptsManager.md#getreceiptbytxhash)
- [getReceipts](ReceiptsManager.md#getreceipts)
- [logsBloom](ReceiptsManager.md#logsbloom)
- [put](ReceiptsManager.md#put)
- [rlp](ReceiptsManager.md#rlp)
- [saveReceipts](ReceiptsManager.md#savereceipts)
- [updateIndex](ReceiptsManager.md#updateindex)

## Constructors

### constructor

• **new ReceiptsManager**(`options`): [`ReceiptsManager`](ReceiptsManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `MetaDBManagerOptions` |

#### Returns

[`ReceiptsManager`](ReceiptsManager.md)

#### Inherited from

MetaDBManager.constructor

#### Defined in

[packages/blockchain/src/MetaDbManager.ts:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/MetaDbManager.ts#L53)

## Properties

### GET\_LOGS\_BLOCK\_RANGE\_LIMIT

• **GET\_LOGS\_BLOCK\_RANGE\_LIMIT**: `number` = `2500`

Block range limit for getLogs

#### Defined in

[packages/blockchain/src/RecieptManager.ts:107](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L107)

___

### GET\_LOGS\_LIMIT

• **GET\_LOGS\_LIMIT**: `number` = `10000`

Limit of logs to return in getLogs

#### Defined in

[packages/blockchain/src/RecieptManager.ts:97](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L97)

___

### GET\_LOGS\_LIMIT\_MEGABYTES

• **GET\_LOGS\_LIMIT\_MEGABYTES**: `number` = `150`

Size limit for the getLogs response in megabytes

#### Defined in

[packages/blockchain/src/RecieptManager.ts:102](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L102)

___

### chain

• `Protected` **chain**: [`Chain`](Chain.md)

#### Inherited from

MetaDBManager.chain

#### Defined in

[packages/blockchain/src/MetaDbManager.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/MetaDbManager.ts#L45)

___

### common

• `Protected` **common**: `Common`

#### Inherited from

MetaDBManager.common

#### Defined in

[packages/blockchain/src/MetaDbManager.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/MetaDbManager.ts#L46)

## Methods

### delete

▸ **delete**(`type`, `hash`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `DBKey` |
| `hash` | `Uint8Array` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

MetaDBManager.delete

#### Defined in

[packages/blockchain/src/MetaDbManager.ts:78](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/MetaDbManager.ts#L78)

___

### deleteReceipts

▸ **deleteReceipts**(`block`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `block` | `Block` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/blockchain/src/RecieptManager.ts:121](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L121)

___

### get

▸ **get**(`type`, `hash`): `Promise`\<``null`` \| `Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `DBKey` |
| `hash` | `Uint8Array` |

#### Returns

`Promise`\<``null`` \| `Uint8Array`\>

#### Inherited from

MetaDBManager.get

#### Defined in

[packages/blockchain/src/MetaDbManager.ts:67](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/MetaDbManager.ts#L67)

___

### getIndex

▸ **getIndex**(`type`, `value`): `Promise`\<``null`` \| `TxHashIndex`\>

Returns the value for an index or null if not found

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `TxHash` | the IndexType |
| `value` | `Uint8Array` | for IndexType.TxHash, the txHash to get |

#### Returns

`Promise`\<``null`` \| `TxHashIndex`\>

#### Defined in

[packages/blockchain/src/RecieptManager.ts:306](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L306)

___

### getLogs

▸ **getLogs**(`from`, `to`, `addresses?`, `topics?`): `Promise`\<`GetLogsReturn`\>

Returns logs as specified by the eth_getLogs JSON RPC query parameters

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `from` | `Block` | `undefined` |
| `to` | `Block` | `undefined` |
| `addresses?` | `Uint8Array`[] | `undefined` |
| `topics` | (``null`` \| `Uint8Array` \| `Uint8Array`[])[] | `[]` |

#### Returns

`Promise`\<`GetLogsReturn`\>

#### Defined in

[packages/blockchain/src/RecieptManager.ts:196](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L196)

___

### getReceiptByTxHash

▸ **getReceiptByTxHash**(`txHash`): `Promise`\<``null`` \| `GetReceiptByTxHashReturn`\>

Returns receipt by tx hash with additional metadata for the JSON RPC response, or null if not found

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `txHash` | `Uint8Array` | the tx hash |

#### Returns

`Promise`\<``null`` \| `GetReceiptByTxHashReturn`\>

#### Defined in

[packages/blockchain/src/RecieptManager.ts:173](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L173)

___

### getReceipts

▸ **getReceipts**(`blockHash`, `calcBloom?`, `includeTxType?`): `Promise`\<`TxReceiptWithType`[]\>

Returns receipts for given blockHash

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockHash` | `Uint8Array` | the block hash |
| `calcBloom?` | `boolean` | whether to calculate and return the logs bloom for each receipt (default: false) |
| `includeTxType?` | ``true`` | whether to include the tx type for each receipt (default: false) |

#### Returns

`Promise`\<`TxReceiptWithType`[]\>

#### Defined in

[packages/blockchain/src/RecieptManager.ts:132](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L132)

▸ **getReceipts**(`blockHash`, `calcBloom?`, `includeTxType?`): `Promise`\<`TxReceipt`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockHash` | `Uint8Array` |
| `calcBloom?` | `boolean` |
| `includeTxType?` | ``false`` |

#### Returns

`Promise`\<`TxReceipt`[]\>

#### Defined in

[packages/blockchain/src/RecieptManager.ts:137](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L137)

___

### logsBloom

▸ **logsBloom**(`logs`): `Bloom`

Returns the logs bloom for a receipt's logs

#### Parameters

| Name | Type |
| :------ | :------ |
| `logs` | `Log`[] |

#### Returns

`Bloom`

#### Defined in

[packages/blockchain/src/RecieptManager.ts:416](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L416)

___

### put

▸ **put**(`type`, `hash`, `value`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `DBKey` |
| `hash` | `Uint8Array` |
| `value` | `Uint8Array` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

MetaDBManager.put

#### Defined in

[packages/blockchain/src/MetaDbManager.ts:63](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/MetaDbManager.ts#L63)

___

### rlp

▸ **rlp**(`conversion`, `type`, `value`): `Uint8Array`

RLP encodes or decodes the specified data type for storage or retrieval from the metaDB

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `conversion` | `Encode` | RlpConvert.Encode or RlpConvert.Decode |
| `type` | `RlpType` | one of RlpType |
| `value` | `rlpOut` | the value to encode or decode |

#### Returns

`Uint8Array`

#### Defined in

[packages/blockchain/src/RecieptManager.ts:331](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L331)

▸ **rlp**(`conversion`, `type`, `values`): `TxReceipt`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `conversion` | `Decode` |
| `type` | `Receipts` |
| `values` | `Uint8Array` |

#### Returns

`TxReceipt`[]

#### Defined in

[packages/blockchain/src/RecieptManager.ts:336](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L336)

▸ **rlp**(`conversion`, `type`, `value`): `Log`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `conversion` | `Decode` |
| `type` | `Logs` |
| `value` | `Log`[] |

#### Returns

`Log`[]

#### Defined in

[packages/blockchain/src/RecieptManager.ts:341](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L341)

▸ **rlp**(`conversion`, `type`, `value`): `TxHashIndex`

#### Parameters

| Name | Type |
| :------ | :------ |
| `conversion` | `Decode` |
| `type` | `TxHash` |
| `value` | `Uint8Array` |

#### Returns

`TxHashIndex`

#### Defined in

[packages/blockchain/src/RecieptManager.ts:346](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L346)

___

### saveReceipts

▸ **saveReceipts**(`block`, `receipts`): `Promise`\<`void`\>

Saves receipts to db. Also saves tx hash indexes if within txLookupLimit,
and removes tx hash indexes for one block past txLookupLimit.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `block` | `Block` | the block to save receipts for |
| `receipts` | `TxReceipt`[] | the receipts to save |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/blockchain/src/RecieptManager.ts:115](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L115)

___

### updateIndex

▸ **updateIndex**(`operation`, `type`, `value`): `Promise`\<`void`\>

Saves or deletes an index from the metaDB

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `operation` | `IndexOperation` | the IndexOperation |
| `type` | `TxHash` | the IndexType |
| `value` | `Block` | for IndexType.TxHash, the block to save or delete the tx hash indexes for |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/blockchain/src/RecieptManager.ts:270](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/RecieptManager.ts#L270)
