[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / TransactionFactory

# Class: TransactionFactory

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:9

## Methods

### fromBlockBodyData()

> `static` **fromBlockBodyData**(`data`, `txOptions`?): [`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md) \| [`LegacyTransaction`](LegacyTransaction.md) \| [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md) \| [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md) \| `EOACodeEIP7702Transaction`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:34

When decoding a BlockBody, in the transactions field, a field is either:
A Uint8Array (a TypedTransaction - encoded as TransactionType || rlp(TransactionPayload))
A Uint8Array[] (Legacy Transaction)
This method returns the right transaction.

#### Parameters

##### data

A Uint8Array or Uint8Array[]

`Uint8Array`\<`ArrayBufferLike`\> | `Uint8Array`\<`ArrayBufferLike`\>[]

##### txOptions?

[`TxOptions`](../interfaces/TxOptions.md)

The transaction options

#### Returns

[`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md) \| [`LegacyTransaction`](LegacyTransaction.md) \| [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md) \| [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md) \| `EOACodeEIP7702Transaction`

***

### fromJsonRpcProvider()

> `static` **fromJsonRpcProvider**(`provider`, `txHash`, `txOptions`?): `Promise`\<[`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md) \| [`LegacyTransaction`](LegacyTransaction.md) \| [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md) \| [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md) \| `EOACodeEIP7702Transaction`\>

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:42

Method to retrieve a transaction from the provider

#### Parameters

##### provider

a url string for a JSON-RPC provider or an Ethers JsonRPCProvider object

`string` | `EthersProvider`

##### txHash

`string`

Transaction hash

##### txOptions?

[`TxOptions`](../interfaces/TxOptions.md)

The transaction options

#### Returns

`Promise`\<[`FeeMarketEIP1559Transaction`](FeeMarketEIP1559Transaction.md) \| [`LegacyTransaction`](LegacyTransaction.md) \| [`AccessListEIP2930Transaction`](AccessListEIP2930Transaction.md) \| [`BlobEIP4844Transaction`](BlobEIP4844Transaction.md) \| `EOACodeEIP7702Transaction`\>

the transaction specified by `txHash`

***

### fromRPC()

> `static` **fromRPC**\<`T`\>(`txData`, `txOptions`?): `Promise`\<`Transaction`\[`T`\]\>

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:50

Method to decode data retrieved from RPC, such as `eth_getTransactionByHash`
Note that this normalizes some of the parameters

#### Type Parameters

• **T** *extends* [`TransactionType`](../enumerations/TransactionType.md)

#### Parameters

##### txData

[`TxData`](../interfaces/TxData.md)\[`T`\]

The RPC-encoded data

##### txOptions?

[`TxOptions`](../interfaces/TxOptions.md)

The transaction options

#### Returns

`Promise`\<`Transaction`\[`T`\]\>

***

### fromSerializedData()

> `static` **fromSerializedData**\<`T`\>(`data`, `txOptions`?): `Transaction`\[`T`\]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:24

This method tries to decode serialized data.

#### Type Parameters

• **T** *extends* [`TransactionType`](../enumerations/TransactionType.md)

#### Parameters

##### data

`Uint8Array`

The data Uint8Array

##### txOptions?

[`TxOptions`](../interfaces/TxOptions.md)

The transaction options

#### Returns

`Transaction`\[`T`\]

***

### fromTxData()

> `static` **fromTxData**\<`T`\>(`txData`, `txOptions`?): `Transaction`\[`T`\]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:17

Create a transaction from a `txData` object

#### Type Parameters

• **T** *extends* [`TransactionType`](../enumerations/TransactionType.md)

#### Parameters

##### txData

`TypedTxData`

The transaction data. The `type` field will determine which transaction type is returned (if undefined, creates a legacy transaction)

##### txOptions?

[`TxOptions`](../interfaces/TxOptions.md)

Options to pass on to the constructor of the transaction

#### Returns

`Transaction`\[`T`\]
