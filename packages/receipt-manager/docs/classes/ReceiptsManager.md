[**@tevm/receipt-manager**](../README.md)

***

[@tevm/receipt-manager](../globals.md) / ReceiptsManager

# Class: ReceiptsManager

Defined in: [RecieptManager.ts:124](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L124)

## Constructors

### new ReceiptsManager()

> **new ReceiptsManager**(`mapDb`, `chain`): [`ReceiptsManager`](ReceiptsManager.md)

Defined in: [RecieptManager.ts:125](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L125)

#### Parameters

##### mapDb

[`MapDb`](../type-aliases/MapDb.md)

##### chain

`Chain`

#### Returns

[`ReceiptsManager`](ReceiptsManager.md)

## Properties

### chain

> `readonly` **chain**: `Chain`

Defined in: [RecieptManager.ts:127](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L127)

***

### GET\_LOGS\_BLOCK\_RANGE\_LIMIT

> **GET\_LOGS\_BLOCK\_RANGE\_LIMIT**: `number` = `2500`

Defined in: [RecieptManager.ts:142](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L142)

Block range limit for getLogs

***

### GET\_LOGS\_LIMIT

> **GET\_LOGS\_LIMIT**: `number` = `10000`

Defined in: [RecieptManager.ts:132](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L132)

Limit of logs to return in getLogs

***

### GET\_LOGS\_LIMIT\_MEGABYTES

> **GET\_LOGS\_LIMIT\_MEGABYTES**: `number` = `150`

Defined in: [RecieptManager.ts:137](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L137)

Size limit for the getLogs response in megabytes

***

### mapDb

> `readonly` **mapDb**: [`MapDb`](../type-aliases/MapDb.md)

Defined in: [RecieptManager.ts:126](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L126)

## Methods

### deepCopy()

> **deepCopy**(`chain`): [`ReceiptsManager`](ReceiptsManager.md)

Defined in: [RecieptManager.ts:144](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L144)

#### Parameters

##### chain

`Chain`

#### Returns

[`ReceiptsManager`](ReceiptsManager.md)

***

### deleteReceipts()

> **deleteReceipts**(`block`): `Promise`\<`void`\>

Defined in: [RecieptManager.ts:160](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L160)

#### Parameters

##### block

`Block`

#### Returns

`Promise`\<`void`\>

***

### getLogs()

> **getLogs**(`from`, `to`, `addresses`?, `topics`?): `Promise`\<`GetLogsReturn`\>

Defined in: [RecieptManager.ts:225](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L225)

Returns logs as specified by the eth_getLogs JSON RPC query parameters

#### Parameters

##### from

`Block`

##### to

`Block`

##### addresses?

`Uint8Array`\<`ArrayBufferLike`\>[]

##### topics?

(`null` \| `Uint8Array`\<`ArrayBufferLike`\> \| `Uint8Array`\<`ArrayBufferLike`\>[])[] = `[]`

#### Returns

`Promise`\<`GetLogsReturn`\>

***

### getReceiptByTxHash()

> **getReceiptByTxHash**(`txHash`): `Promise`\<`null` \| `GetReceiptByTxHashReturn`\>

Defined in: [RecieptManager.ts:204](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L204)

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

Defined in: [RecieptManager.ts:171](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L171)

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

Defined in: [RecieptManager.ts:172](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L172)

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

Defined in: [RecieptManager.ts:154](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L154)

Saves receipts to db. Also saves tx hash indexes if within txLookupLimit,
and removes tx hash indexes for one block past txLookupLimit.

#### Parameters

##### block

`Block`

the block to save receipts for

##### receipts

[`TxReceipt`](../type-aliases/TxReceipt.md)[]

the receipts to save

#### Returns

`Promise`\<`void`\>
