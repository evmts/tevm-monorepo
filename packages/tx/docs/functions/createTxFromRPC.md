[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / createTxFromRPC

# Function: createTxFromRPC()

> **createTxFromRPC**\<`T`\>(`txData`, `txOptions`?): `Promise`\<`Transaction`\[`T`\]\>

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:35

Method to decode data retrieved from RPC, such as `eth_getTransactionByHash`
Note that this normalizes some of the parameters

## Type Parameters

• **T** *extends* [`TransactionType`](../enumerations/TransactionType.md)

## Parameters

### txData

[`TxData`](../interfaces/TxData.md)\[`T`\]

The RPC-encoded data

### txOptions?

[`TxOptions`](../interfaces/TxOptions.md)

The transaction options

## Returns

`Promise`\<`Transaction`\[`T`\]\>
