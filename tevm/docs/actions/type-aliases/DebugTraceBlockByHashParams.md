[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceBlockByHashParams

# Type Alias: DebugTraceBlockByHashParams\<TTracer, TDiffMode\>

> **DebugTraceBlockByHashParams**\<`TTracer`, `TDiffMode`\> = [`TraceParams`](TraceParams.md)\<`TTracer`, `TDiffMode`\> & `object`

Params taken by `debug_traceBlockByHash` handler

## Type Declaration

### blockHash

> `readonly` **blockHash**: [`Hex`](Hex.md) \| `Uint8Array`

Block hash to trace

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined` | `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined` |
| `TDiffMode` *extends* `boolean` | `boolean` |
