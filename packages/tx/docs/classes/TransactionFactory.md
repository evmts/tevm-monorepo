**@tevm/tx** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > TransactionFactory

# Class: TransactionFactory

## Constructors

### new TransactionFactory()

> **`private`** **new TransactionFactory**(): [`TransactionFactory`](TransactionFactory.md)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:9

## Methods

### fromBlockBodyData()

> **`static`** **fromBlockBodyData**(`data`, `txOptions`?): [`LegacyTransaction`](LegacyTransaction.md) \| [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md) \| [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md) \| [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)

When decoding a BlockBody, in the transactions field, a field is either:
A Uint8Array (a TypedTransaction - encoded as TransactionType || rlp(TransactionPayload))
A Uint8Array[] (Legacy Transaction)
This method returns the right transaction.

#### Parameters

▪ **data**: `Uint8Array` \| `Uint8Array`[]

A Uint8Array or Uint8Array[]

▪ **txOptions?**: `TxOptions`

The transaction options

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:33

***

### fromJsonRpcProvider()

> **`static`** **fromJsonRpcProvider**(`provider`, `txHash`, `txOptions`?): `Promise`\<[`LegacyTransaction`](LegacyTransaction.md) \| [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md) \| [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md) \| [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md)\>

Method to retrieve a transaction from the provider

#### Parameters

▪ **provider**: `string` \| `EthersProvider`

a url string for a JSON-RPC provider or an Ethers JsonRPCProvider object

▪ **txHash**: `string`

Transaction hash

▪ **txOptions?**: `TxOptions`

The transaction options

#### Returns

the transaction specified by `txHash`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:41

***

### fromRPC()

> **`static`** **fromRPC**\<`T`\>(`txData`, `txOptions`?): `Promise`\<`Transaction`[`T`]\>

Method to decode data retrieved from RPC, such as `eth_getTransactionByHash`
Note that this normalizes some of the parameters

#### Type parameters

▪ **T** extends `TransactionType`

#### Parameters

▪ **txData**: [`TxData`](../interfaces/TxData.md)[`T`]

The RPC-encoded data

▪ **txOptions?**: `TxOptions`

The transaction options

#### Returns

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:49

***

### fromSerializedData()

> **`static`** **fromSerializedData**\<`T`\>(`data`, `txOptions`?): `Transaction`[`T`]

This method tries to decode serialized data.

#### Type parameters

▪ **T** extends `TransactionType`

#### Parameters

▪ **data**: `Uint8Array`

The data Uint8Array

▪ **txOptions?**: `TxOptions`

The transaction options

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:23

***

### fromTxData()

> **`static`** **fromTxData**\<`T`\>(`txData`, `txOptions`?): `Transaction`[`T`]

Create a transaction from a `txData` object

#### Type parameters

▪ **T** extends `TransactionType`

#### Parameters

▪ **txData**: `TypedTxData`

The transaction data. The `type` field will determine which transaction type is returned (if undefined, creates a legacy transaction)

▪ **txOptions?**: `TxOptions`

Options to pass on to the constructor of the transaction

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:16

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
