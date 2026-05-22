[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / handleTransactionCreation

# Function: handleTransactionCreation()

> **handleTransactionCreation**(`client`, `params`, `executedCall`, `evmInput`): `Promise`\<\{ `errors?`: `undefined`; `hash`: `` `0x${string}` `` \| `undefined`; \} \| \{ `errors`: [`TevmCallError`](../type-aliases/TevmCallError.md)[]; `hash?`: `undefined`; \}\>

Defined in: [packages/actions/src/Call/handleTransactionCreation.js:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/handleTransactionCreation.js#L15)

Handles the creation of a transaction based on the call parameters and execution result.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |
| `params` | [`CallParams`](../type-aliases/CallParams.md)\<`boolean`\> | - |
| `executedCall` | [`ExecuteCallResult`](../type-aliases/ExecuteCallResult.md) | - |
| `evmInput` | `EVMRunCallOpts` | - |

## Returns

`Promise`\<\{ `errors?`: `undefined`; `hash`: `` `0x${string}` `` \| `undefined`; \} \| \{ `errors`: [`TevmCallError`](../type-aliases/TevmCallError.md)[]; `hash?`: `undefined`; \}\>

## Throws
