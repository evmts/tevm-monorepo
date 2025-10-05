[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceCallParams

# Type Alias: DebugTraceCallParams\<TTracer, TDiffMode\>

> **DebugTraceCallParams**\<`TTracer`, `TDiffMode`\> = [`TraceParams`](TraceParams.md)\<`TTracer`, `TDiffMode`\> & [`EthCallParams`](EthCallParams.md)

Defined in: packages/actions/types/debug/DebugParams.d.ts:54

Params taken by `debug_traceCall` handler

## Type Parameters

### TTracer

`TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `undefined` = `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `undefined`

### TDiffMode

`TDiffMode` *extends* `boolean` = `boolean`
