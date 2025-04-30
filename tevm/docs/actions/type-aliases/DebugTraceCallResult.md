[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceCallResult

# Type Alias: DebugTraceCallResult\<TTracer, TDiffMode\>

> **DebugTraceCallResult**\<`TTracer`, `TDiffMode`\>: `TTracer` *extends* `"callTracer"` ? [`TraceResult`](../../index/type-aliases/TraceResult.md) : `TTracer` *extends* `"prestateTracer"` ? [`PrestateTraceAnyResult`](PrestateTraceAnyResult.md)\<`TDiffMode`\> : [`TraceResult`](../../index/type-aliases/TraceResult.md)

Defined in: packages/actions/types/debug/DebugResult.d.ts:66

Result from `debug_traceCall`

## Type Parameters

• **TTracer** *extends* `"callTracer"` \| `"prestateTracer"` = `"callTracer"` \| `"prestateTracer"`

• **TDiffMode** *extends* `boolean` = `boolean`
