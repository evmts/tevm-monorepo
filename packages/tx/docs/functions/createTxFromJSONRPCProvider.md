[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / createTxFromJSONRPCProvider

# Function: createTxFromJSONRPCProvider()

> **createTxFromJSONRPCProvider**(`provider`, `txHash`, `txOptions`?): `Promise`\<[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md) \| [`LegacyTx`](../classes/LegacyTx.md) \| [`AccessList2930Transaction`](../classes/AccessList2930Transaction.md) \| [`Blob4844Tx`](../classes/Blob4844Tx.md) \| `EOACode7702Transaction`\>

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/transactionFactory.d.ts:43

Method to retrieve a transaction from the provider

## Parameters

### provider

a url string for a JSON-RPC provider or an Ethers JSONRPCProvider object

`string` | `EthersProvider`

### txHash

`string`

Transaction hash

### txOptions?

[`TxOptions`](../interfaces/TxOptions.md)

The transaction options

## Returns

`Promise`\<[`FeeMarket1559Tx`](../classes/FeeMarket1559Tx.md) \| [`LegacyTx`](../classes/LegacyTx.md) \| [`AccessList2930Transaction`](../classes/AccessList2930Transaction.md) \| [`Blob4844Tx`](../classes/Blob4844Tx.md) \| `EOACode7702Transaction`\>

the transaction specified by `txHash`
