[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / createTx

# Function: createTx()

> **createTx**\<`T`\>(`txData`, `txOptions`?): `Transaction`\[`T`\]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:10

Create a transaction from a `txData` object

## Type Parameters

• **T** *extends* [`TransactionType`](../enumerations/TransactionType.md)

## Parameters

### txData

`TypedTxData`

The transaction data. The `type` field will determine which transaction type is returned (if undefined, creates a legacy transaction)

### txOptions?

[`TxOptions`](../interfaces/TxOptions.md)

Options to pass on to the constructor of the transaction

## Returns

`Transaction`\[`T`\]
