[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [tx](../README.md) / createTxFromBlockBodyData

# Function: createTxFromBlockBodyData()

> **createTxFromBlockBodyData**(`data`, `txOptions?`): [`LegacyTransaction`](../classes/LegacyTransaction.md) \| [`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md) \| [`AccessListEIP2930Transaction`](../classes/AccessListEIP2930Transaction.md) \| [`BlobEIP4844Transaction`](../classes/BlobEIP4844Transaction.md) \| `EOACode7702Tx`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:27

When decoding a BlockBody, in the transactions field, a field is either:
A Uint8Array (a TypedTransaction - encoded as TransactionType || rlp(TransactionPayload))
A Uint8Array[] (Legacy Transaction)
This method returns the right transaction.

## Parameters

### data

A Uint8Array or Uint8Array[]

`Uint8Array`\<`ArrayBufferLike`\> | `Uint8Array`\<`ArrayBufferLike`\>[]

### txOptions?

[`TxOptions`](../interfaces/TxOptions.md)

The transaction options

## Returns

[`LegacyTransaction`](../classes/LegacyTransaction.md) \| [`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md) \| [`AccessListEIP2930Transaction`](../classes/AccessListEIP2930Transaction.md) \| [`BlobEIP4844Transaction`](../classes/BlobEIP4844Transaction.md) \| `EOACode7702Tx`
