[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / handleTransactionCreation

# Function: handleTransactionCreation()

> **handleTransactionCreation**(`client`, `params`, `executedCall`, `evmInput`): `Promise`\<\{ `errors`: `never`; `hash`: `` `0x${string}` ``; \} \| \{ `errors`: [`TevmCallError`](../type-aliases/TevmCallError.md)[]; `hash`: `never`; \}\>

Defined in: [packages/actions/src/Call/handleTransactionCreation.js:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/handleTransactionCreation.js#L15)

Handles the creation of a transaction based on the call parameters and execution result.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{\}\>

The TEVM base client instance.

### params

[`CallParams`](../type-aliases/CallParams.md)\<`boolean`\>

The call parameters.

### executedCall

[`ExecuteCallResult`](../type-aliases/ExecuteCallResult.md)

The result of the executed call.

### evmInput

`EVMRunCallOpts`

The EVM input parameters.

## Returns

`Promise`\<\{ `errors`: `never`; `hash`: `` `0x${string}` ``; \} \| \{ `errors`: [`TevmCallError`](../type-aliases/TevmCallError.md)[]; `hash`: `never`; \}\>

A promise that resolves to the transaction hash or undefined.

## Throws

Returns errors as values
