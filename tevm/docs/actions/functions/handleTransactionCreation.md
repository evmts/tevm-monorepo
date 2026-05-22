[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / handleTransactionCreation

# Function: handleTransactionCreation()

> **handleTransactionCreation**(`client`, `params`, `executedCall`, `evmInput`): `Promise`\<\{ `errors?`: `undefined`; `hash`: `` `0x${string}` `` \| `undefined`; \} \| \{ `errors`: [`TevmCallError`](../type-aliases/TevmCallError.md)[]; `hash?`: `undefined`; \}\>

## Parameters

| Parameter | Type |
| ------ | ------ |
| `client` | [`TevmNode`](../../index/type-aliases/TevmNode.md)\<`"fork"` \| `"normal"`, \{ \}\> |
| `params` | [`CallParams`](../type-aliases/CallParams.md)\<`boolean`\> |
| `executedCall` | [`ExecuteCallResult`](../type-aliases/ExecuteCallResult.md) |
| `evmInput` | [`EvmRunCallOpts`](../../evm/interfaces/EvmRunCallOpts.md) |

## Returns

`Promise`\<\{ `errors?`: `undefined`; `hash`: `` `0x${string}` `` \| `undefined`; \} \| \{ `errors`: [`TevmCallError`](../type-aliases/TevmCallError.md)[]; `hash?`: `undefined`; \}\>
