[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceChainParams

# Type Alias: DebugTraceChainParams\<TTracer, TDiffMode\>

> **DebugTraceChainParams**\<`TTracer`, `TDiffMode`\> = `object`

Defined in: [packages/actions/src/debug/DebugParams.ts:310](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L310)

Params taken by `debug_traceChain` handler

## Type Parameters

### TTracer

`TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined` = `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined`

### TDiffMode

`TDiffMode` *extends* `boolean` = `boolean`

## Properties

### endBlock

> `readonly` **endBlock**: [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint` \| [`BlockTag`](BlockTag.md)

Defined in: [packages/actions/src/debug/DebugParams.ts:327](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L327)

Ending block number, hash, or tag

***

### startBlock

> `readonly` **startBlock**: [`Hex`](Hex.md) \| `Uint8Array` \| `number` \| `bigint` \| [`BlockTag`](BlockTag.md)

Defined in: [packages/actions/src/debug/DebugParams.ts:323](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L323)

Starting block number, hash, or tag

***

### traceConfig?

> `readonly` `optional` **traceConfig**: [`TraceParams`](TraceParams.md)\<`TTracer`, `TDiffMode`\>

Defined in: [packages/actions/src/debug/DebugParams.ts:331](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L331)

Trace configuration options
