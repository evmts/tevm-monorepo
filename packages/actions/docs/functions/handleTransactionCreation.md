[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / handleTransactionCreation

# Function: handleTransactionCreation()

> **handleTransactionCreation**(`client`, `params`, `executedCall`, `evmInput`): `Promise`\<`object` \| `object`\>

## Parameters

• **client**: `TevmNode`\<`"fork"` \| `"normal"`, `object`\>

The TEVM base client instance.

• **params**: [`CallParams`](../type-aliases/CallParams.md)\<`boolean`\>

The call parameters.

• **executedCall**: [`ExecuteCallResult`](../type-aliases/ExecuteCallResult.md)

The result of the executed call.

• **evmInput**: `EVMRunCallOpts`

The EVM input parameters.

## Returns

`Promise`\<`object` \| `object`\>

A promise that resolves to the transaction hash or undefined.

## Defined in

[packages/actions/src/Call/handleTransactionCreation.js:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/handleTransactionCreation.js#L15)
