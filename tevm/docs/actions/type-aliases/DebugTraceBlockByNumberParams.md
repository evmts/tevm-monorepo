[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceBlockByNumberParams

# Type Alias: DebugTraceBlockByNumberParams\<TTracer, TDiffMode\>

> **DebugTraceBlockByNumberParams**\<`TTracer`, `TDiffMode`\> = [`TraceParams`](TraceParams.md)\<`TTracer`, `TDiffMode`\> & `object`

Defined in: packages/actions/types/debug/DebugParams.d.ts:80

Params taken by `debug_traceBlockByNumber` handler

## Type Declaration

### blockNumber

> `readonly` **blockNumber**: [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint` \| [`BlockTag`](BlockTag.md)

Block number to trace (can be a hex string, number, bigint, or block tag like 'latest')

## Type Parameters

### TTracer

`TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined` = `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined`

### TDiffMode

`TDiffMode` *extends* `boolean` = `boolean`
