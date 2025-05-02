[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceBlockParams

# Type Alias: DebugTraceBlockParams\<TTracer, TDiffMode\>

> **DebugTraceBlockParams**\<`TTracer`, `TDiffMode`\>: [`TraceParams`](TraceParams.md)\<`TTracer`, `TDiffMode`\> & `ExactlyOne`\<\{ `block`: [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint` \| [`BlockTag`](BlockTag.md); `blockHash`: [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint`; `blockNumber`: [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint`; `blockTag`: [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint` \| [`BlockTag`](BlockTag.md); \}, `"block"` \| `"blockTag"` \| `"blockHash"` \| `"blockNumber"`\>

Defined in: [packages/actions/src/debug/DebugParams.ts:79](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L79)

Params taken by `debug_traceBlock` handler

## Type Parameters

• **TTracer** *extends* `"callTracer"` \| `"prestateTracer"` \| `undefined` = `"callTracer"` \| `"prestateTracer"` \| `undefined`

• **TDiffMode** *extends* `boolean` = `boolean`
