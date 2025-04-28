[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceTransactionResult

# Type Alias: DebugTraceTransactionResult\<TTracer, TDiffMode\>

> **DebugTraceTransactionResult**\<`TTracer`, `TDiffMode`\>: `TTracer` *extends* `"callTracer"` ? [`TraceResult`](../../index/type-aliases/TraceResult.md) : `TTracer` *extends* `"prestateTracer"` ? [`PrestateTraceAnyResult`](PrestateTraceAnyResult.md)\<`TDiffMode`\> : [`TraceResult`](../../index/type-aliases/TraceResult.md)

Defined in: packages/actions/types/debug/DebugResult.d.ts:62

Result from `debug_traceTransaction`

## Type Parameters

• **TTracer** *extends* `"callTracer"` \| `"prestateTracer"` = `"callTracer"` \| `"prestateTracer"`

• **TDiffMode** *extends* `boolean` = `boolean`
