[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [receipt-manager](../README.md) / ReceiptsManager

# Class: ReceiptsManager

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:82

## Constructors

### new ReceiptsManager()

> **new ReceiptsManager**(`mapDb`, `chain`): [`ReceiptsManager`](ReceiptsManager.md)

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:85

#### Parameters

##### mapDb

[`MapDb`](../type-aliases/MapDb.md)

##### chain

[`Chain`](../../blockchain/type-aliases/Chain.md)

#### Returns

[`ReceiptsManager`](ReceiptsManager.md)

## Properties

### chain

> `readonly` **chain**: [`Chain`](../../blockchain/type-aliases/Chain.md)

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:84

***

### GET\_LOGS\_BLOCK\_RANGE\_LIMIT

> **GET\_LOGS\_BLOCK\_RANGE\_LIMIT**: `number`

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:97

Block range limit for getLogs

***

### GET\_LOGS\_LIMIT

> **GET\_LOGS\_LIMIT**: `number`

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:89

Limit of logs to return in getLogs

***

### GET\_LOGS\_LIMIT\_MEGABYTES

> **GET\_LOGS\_LIMIT\_MEGABYTES**: `number`

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:93

Size limit for the getLogs response in megabytes

***

### mapDb

> `readonly` **mapDb**: [`MapDb`](../type-aliases/MapDb.md)

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:83

## Methods

### deepCopy()

> **deepCopy**(`chain`): [`ReceiptsManager`](ReceiptsManager.md)

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:98

#### Parameters

##### chain

[`Chain`](../../blockchain/type-aliases/Chain.md)

#### Returns

[`ReceiptsManager`](ReceiptsManager.md)

***

### deleteReceipts()

> **deleteReceipts**(`block`): `Promise`\<`void`\>

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:106

#### Parameters

##### block

[`Block`](../../block/classes/Block.md)

#### Returns

`Promise`\<`void`\>

***

### getLogs()

> **getLogs**(`from`, `to`, `addresses`?, `topics`?): `Promise`\<`GetLogsReturn`\>

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:123

Returns logs as specified by the eth_getLogs JSON RPC query parameters

#### Parameters

##### from

[`Block`](../../block/classes/Block.md)

##### to

[`Block`](../../block/classes/Block.md)

##### addresses?

`Uint8Array`\<`ArrayBufferLike`\>[]

##### topics?

(`null` \| `Uint8Array`\<`ArrayBufferLike`\> \| `Uint8Array`\<`ArrayBufferLike`\>[])[]

#### Returns

`Promise`\<`GetLogsReturn`\>

***

### getReceiptByTxHash()

> **getReceiptByTxHash**(`txHash`): `Promise`\<`null` \| `GetReceiptByTxHashReturn`\>

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:119

Returns receipt by tx hash with additional metadata for the JSON RPC response, or null if not found

#### Parameters

##### txHash

`Uint8Array`

the tx hash

#### Returns

`Promise`\<`null` \| `GetReceiptByTxHashReturn`\>

***

### getReceipts()

#### Call Signature

> **getReceipts**(`blockHash`, `calcBloom`?, `includeTxType`?): `Promise`\<[`TxReceiptWithType`](../type-aliases/TxReceiptWithType.md)[]\>

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:113

Returns receipts for given blockHash

##### Parameters

###### blockHash

`Uint8Array`

the block hash

###### calcBloom?

`boolean`

whether to calculate and return the logs bloom for each receipt (default: false)

###### includeTxType?

`true`

whether to include the tx type for each receipt (default: false)

##### Returns

`Promise`\<[`TxReceiptWithType`](../type-aliases/TxReceiptWithType.md)[]\>

#### Call Signature

> **getReceipts**(`blockHash`, `calcBloom`?, `includeTxType`?): `Promise`\<[`TxReceipt`](../type-aliases/TxReceipt.md)[]\>

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:114

Returns receipts for given blockHash

##### Parameters

###### blockHash

`Uint8Array`

the block hash

###### calcBloom?

`boolean`

whether to calculate and return the logs bloom for each receipt (default: false)

###### includeTxType?

`false`

whether to include the tx type for each receipt (default: false)

##### Returns

`Promise`\<[`TxReceipt`](../type-aliases/TxReceipt.md)[]\>

***

### saveReceipts()

> **saveReceipts**(`block`, `receipts`): `Promise`\<`void`\>

Defined in: packages/receipt-manager/types/RecieptManager.d.ts:105

Saves receipts to db. Also saves tx hash indexes if within txLookupLimit,
and removes tx hash indexes for one block past txLookupLimit.

#### Parameters

##### block

[`Block`](../../block/classes/Block.md)

the block to save receipts for

##### receipts

[`TxReceipt`](../type-aliases/TxReceipt.md)[]

the receipts to save

#### Returns

`Promise`\<`void`\>
