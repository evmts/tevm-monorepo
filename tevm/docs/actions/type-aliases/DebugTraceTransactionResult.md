[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceTransactionResult

# Type Alias: DebugTraceTransactionResult\<TTracer, TDiffMode\>

> **DebugTraceTransactionResult**\<`TTracer`, `TDiffMode`\> = `TTracer` *extends* `"callTracer"` ? [`CallTraceResult`](CallTraceResult.md) : `TTracer` *extends* `"prestateTracer"` ? [`PrestateTraceResult`](../../index/type-aliases/PrestateTraceResult.md)\<`TDiffMode`\> : `TTracer` *extends* `"4byteTracer"` ? [`FourbyteTraceResult`](FourbyteTraceResult.md) : [`TraceResult`](../../index/type-aliases/TraceResult.md)

Defined in: packages/actions/types/debug/DebugResult.d.ts:16

Result from `debug_traceTransaction`

## Type Parameters

### TTracer

`TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `undefined` = `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `undefined`

### TDiffMode

`TDiffMode` *extends* `boolean` = `boolean`
