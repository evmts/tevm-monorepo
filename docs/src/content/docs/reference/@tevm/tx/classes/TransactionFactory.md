---
editUrl: false
next: false
prev: false
title: "TransactionFactory"
---

## Methods

### fromBlockBodyData()

> `static` **fromBlockBodyData**(`data`, `txOptions`?): [`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/) \| [`LegacyTransaction`](/reference/tevm/tx/classes/legacytransaction/) \| [`AccessListEIP2930Transaction`](/reference/tevm/tx/classes/accesslisteip2930transaction/) \| [`BlobEIP4844Transaction`](/reference/tevm/tx/classes/blobeip4844transaction/) \| `EOACodeEIP7702Transaction`

When decoding a BlockBody, in the transactions field, a field is either:
A Uint8Array (a TypedTransaction - encoded as TransactionType || rlp(TransactionPayload))
A Uint8Array[] (Legacy Transaction)
This method returns the right transaction.

#### Parameters

• **data**: `Uint8Array` \| `Uint8Array`[]

A Uint8Array or Uint8Array[]

• **txOptions?**: [`TxOptions`](/reference/tevm/tx/interfaces/txoptions/)

The transaction options

#### Returns

[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/) \| [`LegacyTransaction`](/reference/tevm/tx/classes/legacytransaction/) \| [`AccessListEIP2930Transaction`](/reference/tevm/tx/classes/accesslisteip2930transaction/) \| [`BlobEIP4844Transaction`](/reference/tevm/tx/classes/blobeip4844transaction/) \| `EOACodeEIP7702Transaction`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:34

***

### fromJsonRpcProvider()

> `static` **fromJsonRpcProvider**(`provider`, `txHash`, `txOptions`?): `Promise`\<[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/) \| [`LegacyTransaction`](/reference/tevm/tx/classes/legacytransaction/) \| [`AccessListEIP2930Transaction`](/reference/tevm/tx/classes/accesslisteip2930transaction/) \| [`BlobEIP4844Transaction`](/reference/tevm/tx/classes/blobeip4844transaction/) \| `EOACodeEIP7702Transaction`\>

Method to retrieve a transaction from the provider

#### Parameters

• **provider**: `string` \| `EthersProvider`

a url string for a JSON-RPC provider or an Ethers JsonRPCProvider object

• **txHash**: `string`

Transaction hash

• **txOptions?**: [`TxOptions`](/reference/tevm/tx/interfaces/txoptions/)

The transaction options

#### Returns

`Promise`\<[`FeeMarketEIP1559Transaction`](/reference/tevm/tx/classes/feemarketeip1559transaction/) \| [`LegacyTransaction`](/reference/tevm/tx/classes/legacytransaction/) \| [`AccessListEIP2930Transaction`](/reference/tevm/tx/classes/accesslisteip2930transaction/) \| [`BlobEIP4844Transaction`](/reference/tevm/tx/classes/blobeip4844transaction/) \| `EOACodeEIP7702Transaction`\>

the transaction specified by `txHash`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:42

***

### fromRPC()

> `static` **fromRPC**\<`T`\>(`txData`, `txOptions`?): `Promise`\<`Transaction`\[`T`\]\>

Method to decode data retrieved from RPC, such as `eth_getTransactionByHash`
Note that this normalizes some of the parameters

#### Type Parameters

• **T** *extends* [`TransactionType`](/reference/tevm/tx/enumerations/transactiontype/)

#### Parameters

• **txData**: [`TxData`](/reference/tevm/tx/interfaces/txdata/)\[`T`\]

The RPC-encoded data

• **txOptions?**: [`TxOptions`](/reference/tevm/tx/interfaces/txoptions/)

The transaction options

#### Returns

`Promise`\<`Transaction`\[`T`\]\>

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:50

***

### fromSerializedData()

> `static` **fromSerializedData**\<`T`\>(`data`, `txOptions`?): `Transaction`\[`T`\]

This method tries to decode serialized data.

#### Type Parameters

• **T** *extends* [`TransactionType`](/reference/tevm/tx/enumerations/transactiontype/)

#### Parameters

• **data**: `Uint8Array`

The data Uint8Array

• **txOptions?**: [`TxOptions`](/reference/tevm/tx/interfaces/txoptions/)

The transaction options

#### Returns

`Transaction`\[`T`\]

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:24

***

### fromTxData()

> `static` **fromTxData**\<`T`\>(`txData`, `txOptions`?): `Transaction`\[`T`\]

Create a transaction from a `txData` object

#### Type Parameters

• **T** *extends* [`TransactionType`](/reference/tevm/tx/enumerations/transactiontype/)

#### Parameters

• **txData**: `TypedTxData`

The transaction data. The `type` field will determine which transaction type is returned (if undefined, creates a legacy transaction)

• **txOptions?**: [`TxOptions`](/reference/tevm/tx/interfaces/txoptions/)

Options to pass on to the constructor of the transaction

#### Returns

`Transaction`\[`T`\]

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:17
