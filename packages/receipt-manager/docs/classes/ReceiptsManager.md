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

#### Defined in

[RecieptManager.ts:125](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L125)

## Properties

### GET\_LOGS\_BLOCK\_RANGE\_LIMIT

> **GET\_LOGS\_BLOCK\_RANGE\_LIMIT**: `number` = `2500`

Block range limit for getLogs

#### Defined in

[RecieptManager.ts:142](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L142)

***

### GET\_LOGS\_LIMIT

> **GET\_LOGS\_LIMIT**: `number` = `10000`

Limit of logs to return in getLogs

#### Defined in

[RecieptManager.ts:132](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L132)

***

### GET\_LOGS\_LIMIT\_MEGABYTES

> **GET\_LOGS\_LIMIT\_MEGABYTES**: `number` = `150`

Size limit for the getLogs response in megabytes

#### Defined in

[RecieptManager.ts:137](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L137)

***

### chain

> `readonly` **chain**: `Chain`

#### Defined in

[RecieptManager.ts:127](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L127)

***

### mapDb

> `readonly` **mapDb**: [`MapDb`](../type-aliases/MapDb.md)

#### Defined in

[RecieptManager.ts:126](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L126)

## Methods

### deleteReceipts()

> **deleteReceipts**(`block`): `Promise`\<`void`\>

#### Parameters

• **block**: `Block`

#### Returns

`Promise`\<`void`\>

#### Defined in

[RecieptManager.ts:156](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L156)

***

### getLogs()

> **getLogs**(`from`, `to`, `addresses`?, `topics`?): `Promise`\<`GetLogsReturn`\>

Returns logs as specified by the eth_getLogs JSON RPC query parameters

#### Parameters

• **from**: `Block`

• **to**: `Block`

• **addresses?**: `Uint8Array`[]

• **topics?**: (`null` \| `Uint8Array` \| `Uint8Array`[])[] = `[]`

#### Returns

`Promise`\<`GetLogsReturn`\>

#### Defined in

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

#### Defined in

[RecieptManager.ts:200](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L200)

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

##### Defined in

[RecieptManager.ts:167](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L167)

#### getReceipts(blockHash, calcBloom, includeTxType)

> **getReceipts**(`blockHash`, `calcBloom`?, `includeTxType`?): `Promise`\<[`TxReceipt`](../type-aliases/TxReceipt.md)[]\>

##### Parameters

• **blockHash**: `Uint8Array`

• **calcBloom?**: `boolean`

• **includeTxType?**: `false`

##### Returns

`Promise`\<[`TxReceipt`](../type-aliases/TxReceipt.md)[]\>

##### Defined in

[RecieptManager.ts:168](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L168)

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

#### Defined in

[RecieptManager.ts:150](https://github.com/evmts/tevm-monorepo/blob/main/packages/receipt-manager/src/RecieptManager.ts#L150)
