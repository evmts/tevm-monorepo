[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / executeCall

# Function: executeCall()

> **executeCall**(`client`, `evmInput`, `params`, `events`?): `Promise`\<[`ExecuteCallResult`](../type-aliases/ExecuteCallResult.md) & `object` \| \{ `errors`: \[[`HandleRunTxError`](../type-aliases/HandleRunTxError.md)\]; \}\>

Defined in: packages/actions/dist/index.d.ts:938

## Parameters

### client

[`TevmNode`](../../index/type-aliases/TevmNode.md)

### evmInput

[`EvmRunCallOpts`](../../evm/interfaces/EvmRunCallOpts.md)

### params

[`CallParams`](../../index/type-aliases/CallParams.md)

### events?

[`CallEvents`](../type-aliases/CallEvents.md)

## Returns

`Promise`\<[`ExecuteCallResult`](../type-aliases/ExecuteCallResult.md) & `object` \| \{ `errors`: \[[`HandleRunTxError`](../type-aliases/HandleRunTxError.md)\]; \}\>
