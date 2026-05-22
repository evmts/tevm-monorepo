[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilSetMinGasPriceJsonRpcProcedure

# Function: anvilSetMinGasPriceJsonRpcProcedure()

> **anvilSetMinGasPriceJsonRpcProcedure**(`client`): [`AnvilSetMinGasPriceProcedure`](../type-aliases/AnvilSetMinGasPriceProcedure.md)

Defined in: [packages/actions/src/anvil/anvilSetMinGasPriceProcedure.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilSetMinGasPriceProcedure.js#L9)

Request handler for anvil_setMinGasPrice JSON-RPC requests.
Sets the minimum gas price for transactions. Transactions with a gas price
below this value will be rejected by the transaction pool.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |

## Returns

[`AnvilSetMinGasPriceProcedure`](../type-aliases/AnvilSetMinGasPriceProcedure.md)
