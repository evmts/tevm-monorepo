[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / callHandlerResult

# Function: callHandlerResult()

> **callHandlerResult**(`evmResult`, `txHash`, `trace`, `accessList`): [`CallResult`](../type-aliases/CallResult.md)\<[`TevmCallError`](../type-aliases/TevmCallError.md)\>

Defined in: tevm-monorepo/packages/actions/types/Call/callHandlerResult.d.ts:1

## Parameters

### evmResult

[`RunTxResult`](../../vm/interfaces/RunTxResult.md) & [`EvmResult`](../../evm/interfaces/EvmResult.md)

### txHash

`` `0x${string}` `` \| `undefined`

### trace

[`TraceResult`](../../index/type-aliases/TraceResult.md) \| `undefined`

### accessList

`Map`\<`string`, `Set`\<`string`\>\> \| `undefined`

## Returns

[`CallResult`](../type-aliases/CallResult.md)\<[`TevmCallError`](../type-aliases/TevmCallError.md)\>
