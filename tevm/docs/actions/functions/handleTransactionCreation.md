[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / handleTransactionCreation

# Function: handleTransactionCreation()

> **handleTransactionCreation**(`client`, `params`, `executedCall`, `evmInput`): `Promise`\<\{ `errors`: `undefined`; `hash`: `undefined` \| `` `0x${string}` ``; \} \| \{ `errors`: [`TevmCallError`](../type-aliases/TevmCallError.md)[]; `hash`: `undefined`; \}\>

Defined in: packages/actions/types/Call/handleTransactionCreation.d.ts:1

## Parameters

### client

[`TevmNode`](../../index/type-aliases/TevmNode.md)\<`"fork"` \| `"normal"`, \{\}\>

### params

[`CallParams`](../type-aliases/CallParams.md)\<`boolean`\>

### executedCall

[`ExecuteCallResult`](../type-aliases/ExecuteCallResult.md)

### evmInput

[`EvmRunCallOpts`](../../evm/interfaces/EvmRunCallOpts.md)

## Returns

`Promise`\<\{ `errors`: `undefined`; `hash`: `undefined` \| `` `0x${string}` ``; \} \| \{ `errors`: [`TevmCallError`](../type-aliases/TevmCallError.md)[]; `hash`: `undefined`; \}\>
