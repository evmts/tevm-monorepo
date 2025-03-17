[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / createTxFromRLP

# Function: createTxFromRLP()

> **createTxFromRLP**\<`T`\>(`data`, `txOptions`?): `Transaction`\[`T`\]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:17

This method tries to decode serialized data.

## Type Parameters

• **T** *extends* [`TransactionType`](../enumerations/TransactionType.md)

## Parameters

### data

`Uint8Array`

The data Uint8Array

### txOptions?

[`TxOptions`](../interfaces/TxOptions.md)

The transaction options

## Returns

`Transaction`\[`T`\]
