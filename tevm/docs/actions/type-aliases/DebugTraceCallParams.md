[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceCallParams

# Type Alias: DebugTraceCallParams\<TTracer, TDiffMode\>

> **DebugTraceCallParams**\<`TTracer`, `TDiffMode`\> = [`TraceParams`](TraceParams.md)\<`TTracer`, `TDiffMode`\> & [`EthCallParams`](EthCallParams.md)

Params taken by `debug_traceCall` handler

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined` | `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined` |
| `TDiffMode` *extends* `boolean` | `boolean` |
