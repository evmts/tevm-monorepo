[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / handleTransactionCreation

# Function: handleTransactionCreation()

> **handleTransactionCreation**(`client`, `params`, `executedCall`, `evmInput`): `Promise`\<\{ `errors`: `undefined`; `hash`: `undefined` \| `` `0x${string}` ``; \} \| \{ `errors`: `any`[]; `hash`: `undefined`; \}\>

Defined in: packages/actions/dist/index.d.ts:1292

## Parameters

### client

[`TevmNode`](../../index/type-aliases/TevmNode.md)

### params

[`CallParams`](../../index/type-aliases/CallParams.md)

### executedCall

[`ExecuteCallResult`](../type-aliases/ExecuteCallResult.md)

### evmInput

[`EvmRunCallOpts`](../../evm/interfaces/EvmRunCallOpts.md)

## Returns

`Promise`\<\{ `errors`: `undefined`; `hash`: `undefined` \| `` `0x${string}` ``; \} \| \{ `errors`: `any`[]; `hash`: `undefined`; \}\>
