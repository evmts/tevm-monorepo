[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / callHandlerResult

# Function: callHandlerResult()

> **callHandlerResult**(`evmResult`, `txHash`, `trace`, `accessList`): [`CallResult`](../type-aliases/CallResult.md)\<[`TevmCallError`](../type-aliases/TevmCallError.md)\>

Defined in: packages/actions/types/Call/callHandlerResult.d.ts:1

## Parameters

### evmResult

[`RunTxResult`](../../vm/interfaces/RunTxResult.md)

### txHash

`undefined` | `` `0x${string}` ``

### trace

`undefined` | [`DebugTraceCallResult`](../type-aliases/DebugTraceCallResult.md)

### accessList

`undefined` | `Map`\<`string`, `Set`\<`string`\>\>

## Returns

[`CallResult`](../type-aliases/CallResult.md)\<[`TevmCallError`](../type-aliases/TevmCallError.md)\>
