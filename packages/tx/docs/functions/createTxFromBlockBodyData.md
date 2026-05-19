[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / createTxFromBlockBodyData

# Function: createTxFromBlockBodyData()

> **createTxFromBlockBodyData**(`data`, `txOptions?`): [`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md) \| [`AccessListEIP2930Transaction`](../classes/AccessListEIP2930Transaction.md) \| [`BlobEIP4844Transaction`](../classes/BlobEIP4844Transaction.md) \| [`EOACodeEIP7702Transaction`](../classes/EOACodeEIP7702Transaction.md) \| [`LegacyTransaction`](../classes/LegacyTransaction.md)

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:27

When decoding a BlockBody, in the transactions field, a field is either:
A Uint8Array (a TypedTransaction - encoded as TransactionType || rlp(TransactionPayload))
A Uint8Array[] (Legacy Transaction)
This method returns the right transaction.

## Parameters

### data

`Uint8Array`\<`ArrayBufferLike`\> \| `Uint8Array`\<`ArrayBufferLike`\>[]

A Uint8Array or Uint8Array[]

### txOptions?

[`TxOptions`](../interfaces/TxOptions.md)

The transaction options

## Returns

[`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md) \| [`AccessListEIP2930Transaction`](../classes/AccessListEIP2930Transaction.md) \| [`BlobEIP4844Transaction`](../classes/BlobEIP4844Transaction.md) \| [`EOACodeEIP7702Transaction`](../classes/EOACodeEIP7702Transaction.md) \| [`LegacyTransaction`](../classes/LegacyTransaction.md)
