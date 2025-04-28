[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / callHandlerResult

# Function: callHandlerResult()

> **callHandlerResult**(`evmResult`, `txHash`, `trace`, `accessList`): [`CallResult`](../../index/type-aliases/CallResult.md)\<[`TevmCallError`](../../index/type-aliases/TevmCallError.md)\>

Defined in: packages/actions/types/Call/callHandlerResult.d.ts:1

## Parameters

### evmResult

[`RunTxResult`](../../vm/interfaces/RunTxResult.md)

### txHash

`undefined` | `` `0x${string}` ``

### trace

`undefined` | [`EvmTraceResult`](../../index/type-aliases/EvmTraceResult.md)

### accessList

`undefined` | `Map`\<`string`, `Set`\<`string`\>\>

## Returns

[`CallResult`](../../index/type-aliases/CallResult.md)\<[`TevmCallError`](../../index/type-aliases/TevmCallError.md)\>
