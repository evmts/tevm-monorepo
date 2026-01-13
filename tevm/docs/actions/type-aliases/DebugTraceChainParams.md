[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceChainParams

# Type Alias: DebugTraceChainParams\<TTracer, TDiffMode\>

> **DebugTraceChainParams**\<`TTracer`, `TDiffMode`\> = `object`

Defined in: packages/actions/types/debug/DebugParams.d.ts:197

Params taken by `debug_traceChain` handler

## Type Parameters

### TTracer

`TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined` = `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined`

### TDiffMode

`TDiffMode` *extends* `boolean` = `boolean`

## Properties

### endBlock

> `readonly` **endBlock**: [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint` \| [`BlockTag`](BlockTag.md)

Defined in: packages/actions/types/debug/DebugParams.d.ts:205

Ending block number, hash, or tag

***

### startBlock

> `readonly` **startBlock**: [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint` \| [`BlockTag`](BlockTag.md)

Defined in: packages/actions/types/debug/DebugParams.d.ts:201

Starting block number, hash, or tag

***

### traceConfig?

> `readonly` `optional` **traceConfig**: [`TraceParams`](TraceParams.md)\<`TTracer`, `TDiffMode`\>

Defined in: packages/actions/types/debug/DebugParams.d.ts:209

Trace configuration options
