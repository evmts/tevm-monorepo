[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / createTxFromBlockBodyData

# Function: createTxFromBlockBodyData()

> **createTxFromBlockBodyData**(`data`, `txOptions`?): [`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md) \| [`LegacyTx`](../classes/LegacyTx.md) \| [`AccessList2930Transaction`](../classes/AccessList2930Transaction.md) \| [`Blob4844Tx`](../classes/Blob4844Tx.md) \| `EOACode7702Transaction`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:27

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

[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md) \| [`LegacyTx`](../classes/LegacyTx.md) \| [`AccessList2930Transaction`](../classes/AccessList2930Transaction.md) \| [`Blob4844Tx`](../classes/Blob4844Tx.md) \| `EOACode7702Transaction`
