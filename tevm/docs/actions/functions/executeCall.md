[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / executeCall

# Function: executeCall()

> **executeCall**(`client`, `evmInput`, `params`): `Promise`\<[`ExecuteCallResult`](../type-aliases/ExecuteCallResult.md) & `object` \| \{ `errors`: \[[`HandleRunTxError`](../type-aliases/HandleRunTxError.md)\]; \}\>

Defined in: packages/actions/types/Call/executeCall.d.ts:1

## Parameters

### client

[`TevmNode`](../../index/type-aliases/TevmNode.md)\<`"fork"` \| `"normal"`, \{\}\>

### evmInput

[`EvmRunCallOpts`](../../evm/interfaces/EvmRunCallOpts.md)

### params

[`CallParams`](../../index/type-aliases/CallParams.md)\<`boolean`\>

## Returns

`Promise`\<[`ExecuteCallResult`](../type-aliases/ExecuteCallResult.md) & `object` \| \{ `errors`: \[[`HandleRunTxError`](../type-aliases/HandleRunTxError.md)\]; \}\>
