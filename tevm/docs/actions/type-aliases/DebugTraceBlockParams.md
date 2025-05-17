[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceBlockParams

# Type Alias: DebugTraceBlockParams\<TTracer, TDiffMode\>

> **DebugTraceBlockParams**\<`TTracer`, `TDiffMode`\> = [`TraceParams`](TraceParams.md)\<`TTracer`, `TDiffMode`\> & `ExactlyOne`\<\{ `block`: [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint` \| [`BlockTag`](BlockTag.md); `blockHash`: [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint`; `blockNumber`: [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint`; `blockTag`: [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint` \| [`BlockTag`](BlockTag.md); \}, `"block"` \| `"blockTag"` \| `"blockHash"` \| `"blockNumber"`\>

Defined in: packages/actions/types/debug/DebugParams.d.ts:58

Params taken by `debug_traceBlock` handler

## Type Parameters

### TTracer

`TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `undefined` = `"callTracer"` \| `"prestateTracer"` \| `undefined`

### TDiffMode

`TDiffMode` *extends* `boolean` = `boolean`
