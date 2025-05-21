[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceCallHandler

# Type Alias: DebugTraceCallHandler()

> **DebugTraceCallHandler** = \<`TTracer`, `TDiffMode`\>(`params`) => `Promise`\<[`DebugTraceCallResult`](DebugTraceCallResult.md)\<`TTracer`, `TDiffMode`\>\>

Defined in: [packages/actions/src/debug/DebugHandler.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugHandler.ts#L6)

## Type Parameters

### TTracer

`TTracer` *extends* `"callTracer"` \| `"prestateTracer"` = `"callTracer"` \| `"prestateTracer"`

### TDiffMode

`TDiffMode` *extends* `boolean` = `boolean`

## Parameters

### params

[`DebugTraceCallParams`](DebugTraceCallParams.md)\<`TTracer`, `TDiffMode`\>

## Returns

`Promise`\<[`DebugTraceCallResult`](DebugTraceCallResult.md)\<`TTracer`, `TDiffMode`\>\>
