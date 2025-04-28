[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceCallHandler

# Type Alias: DebugTraceCallHandler()

> **DebugTraceCallHandler**: \<`TTracer`, `TDiffMode`\>(`params`) => `Promise`\<[`DebugTraceCallResult`](DebugTraceCallResult.md)\<`TTracer`, `TDiffMode`\>\>

Defined in: packages/actions/types/debug/DebugHandler.d.ts:3

## Type Parameters

• **TTracer** *extends* `"callTracer"` \| `"prestateTracer"` = `"callTracer"` \| `"prestateTracer"`

• **TDiffMode** *extends* `boolean` = `boolean`

## Parameters

### params

[`DebugTraceCallParams`](DebugTraceCallParams.md)\<`TTracer`, `TDiffMode`\>

## Returns

`Promise`\<[`DebugTraceCallResult`](DebugTraceCallResult.md)\<`TTracer`, `TDiffMode`\>\>
