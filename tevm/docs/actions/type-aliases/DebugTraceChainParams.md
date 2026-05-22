[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceChainParams

# Type Alias: DebugTraceChainParams\<TTracer, TDiffMode\>

> **DebugTraceChainParams**\<`TTracer`, `TDiffMode`\> = `object`

Params taken by `debug_traceChain` handler

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined` | `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined` |
| `TDiffMode` *extends* `boolean` | `boolean` |

## Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="endblock"></a> `endBlock` | `readonly` | [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint` \| [`BlockTag`](BlockTag.md) | Ending block number, hash, or tag |
| <a id="startblock"></a> `startBlock` | `readonly` | [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint` \| [`BlockTag`](BlockTag.md) | Starting block number, hash, or tag |
| <a id="traceconfig"></a> `traceConfig?` | `readonly` | [`TraceParams`](TraceParams.md)\<`TTracer`, `TDiffMode`\> | Trace configuration options |
