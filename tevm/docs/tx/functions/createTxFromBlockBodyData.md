[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [tx](../README.md) / createTxFromBlockBodyData

# Function: createTxFromBlockBodyData()

> **createTxFromBlockBodyData**(`data`, `txOptions?`): [`LegacyTransaction`](../classes/LegacyTransaction.md) \| [`AccessListEIP2930Transaction`](../classes/AccessListEIP2930Transaction.md) \| [`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md) \| [`BlobEIP4844Transaction`](../classes/BlobEIP4844Transaction.md) \| [`EOACodeEIP7702Transaction`](../classes/EOACodeEIP7702Transaction.md)

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

[`LegacyTransaction`](../classes/LegacyTransaction.md) \| [`AccessListEIP2930Transaction`](../classes/AccessListEIP2930Transaction.md) \| [`FeeMarketEIP1559Transaction`](../classes/FeeMarketEIP1559Transaction.md) \| [`BlobEIP4844Transaction`](../classes/BlobEIP4844Transaction.md) \| [`EOACodeEIP7702Transaction`](../classes/EOACodeEIP7702Transaction.md)
