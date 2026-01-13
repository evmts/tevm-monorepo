[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceCallHandler

# Type Alias: DebugTraceCallHandler()

> **DebugTraceCallHandler** = \<`TTracer`, `TDiffMode`\>(`params`) => `Promise`\<[`DebugTraceCallResult`](DebugTraceCallResult.md)\<`TTracer`, `TDiffMode`\>\>

Defined in: [packages/actions/src/debug/DebugHandler.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugHandler.ts#L26)

## Type Parameters

### TTracer

`TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` = `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"`

### TDiffMode

`TDiffMode` *extends* `boolean` = `boolean`

## Parameters

### params

[`DebugTraceCallParams`](DebugTraceCallParams.md)\<`TTracer`, `TDiffMode`\>

## Returns

`Promise`\<[`DebugTraceCallResult`](DebugTraceCallResult.md)\<`TTracer`, `TDiffMode`\>\>
