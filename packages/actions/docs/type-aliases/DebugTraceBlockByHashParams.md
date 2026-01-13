[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceBlockByHashParams

# Type Alias: DebugTraceBlockByHashParams\<TTracer, TDiffMode\>

> **DebugTraceBlockByHashParams**\<`TTracer`, `TDiffMode`\> = [`TraceParams`](TraceParams.md)\<`TTracer`, `TDiffMode`\> & `object`

Defined in: [packages/actions/src/debug/DebugParams.ts:155](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L155)

Params taken by `debug_traceBlockByHash` handler

## Type Declaration

### blockHash

> `readonly` **blockHash**: [`Hex`](Hex.md) \| `Uint8Array`

Block hash to trace

## Type Parameters

### TTracer

`TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined` = `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined`

### TDiffMode

`TDiffMode` *extends* `boolean` = `boolean`
