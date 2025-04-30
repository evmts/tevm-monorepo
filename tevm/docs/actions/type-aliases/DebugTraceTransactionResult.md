[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceTransactionResult

# Type Alias: DebugTraceTransactionResult\<TTracer, TDiffMode\>

> **DebugTraceTransactionResult**\<`TTracer`, `TDiffMode`\>: `TTracer` *extends* `"callTracer"` ? [`CallTraceResult`](CallTraceResult.md) : `TTracer` *extends* `"prestateTracer"` ? [`PrestateTraceResult`](../../index/type-aliases/PrestateTraceResult.md)\<`TDiffMode`\> : [`TraceResult`](../../index/type-aliases/TraceResult.md)

Defined in: packages/actions/types/debug/DebugResult.d.ts:16

Result from `debug_traceTransaction`

## Type Parameters

• **TTracer** *extends* `"callTracer"` \| `"prestateTracer"` \| `undefined` = `"callTracer"` \| `"prestateTracer"` \| `undefined`

• **TDiffMode** *extends* `boolean` = `boolean`
