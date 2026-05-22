[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceChainParams

# Type Alias: DebugTraceChainParams\<TTracer, TDiffMode\>

> **DebugTraceChainParams**\<`TTracer`, `TDiffMode`\> = `object`

Defined in: [packages/actions/src/debug/DebugParams.ts:310](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L310)

Params taken by `debug_traceChain` handler

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined` | `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined` |
| `TDiffMode` *extends* `boolean` | `boolean` |

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="endblock"></a> `endBlock` | `readonly` | [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint` \| [`BlockTag`](BlockTag.md) | Ending block number, hash, or tag | [packages/actions/src/debug/DebugParams.ts:327](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L327) |
| <a id="startblock"></a> `startBlock` | `readonly` | [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint` \| [`BlockTag`](BlockTag.md) | Starting block number, hash, or tag | [packages/actions/src/debug/DebugParams.ts:323](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L323) |
| <a id="traceconfig"></a> `traceConfig?` | `readonly` | [`TraceParams`](TraceParams.md)\<`TTracer`, `TDiffMode`\> | Trace configuration options | [packages/actions/src/debug/DebugParams.ts:331](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L331) |
