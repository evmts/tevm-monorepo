[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceTransactionResult

# Type Alias: DebugTraceTransactionResult\<TTracer, TDiffMode\>

> **DebugTraceTransactionResult**\<`TTracer`, `TDiffMode`\> = `TTracer` *extends* `"callTracer"` ? [`CallTraceResult`](CallTraceResult.md) : `TTracer` *extends* `"prestateTracer"` ? [`PrestateTraceResult`](../../index/type-aliases/PrestateTraceResult.md)\<`TDiffMode`\> : `TTracer` *extends* `"4byteTracer"` ? [`FourbyteTraceResult`](FourbyteTraceResult.md) : `TTracer` *extends* `"flatCallTracer"` ? [`FlatCallTraceResult`](FlatCallTraceResult.md) : `TTracer` *extends* `"muxTracer"` ? [`MuxTraceResult`](MuxTraceResult.md) : [`TraceResult`](../../index/type-aliases/TraceResult.md)

Result from `debug_traceTransaction`

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined` | `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined` |
| `TDiffMode` *extends* `boolean` | `boolean` |
