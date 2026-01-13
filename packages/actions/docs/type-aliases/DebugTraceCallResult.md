[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceCallResult

# Type Alias: DebugTraceCallResult\<TTracer, TDiffMode\>

> **DebugTraceCallResult**\<`TTracer`, `TDiffMode`\> = `TTracer` *extends* `"callTracer"` ? [`CallTraceResult`](CallTraceResult.md) : `TTracer` *extends* `"prestateTracer"` ? [`PrestateTraceResult`](PrestateTraceResult.md)\<`TDiffMode`\> : `TTracer` *extends* `"4byteTracer"` ? [`FourbyteTraceResult`](FourbyteTraceResult.md) : `TTracer` *extends* `"flatCallTracer"` ? [`FlatCallTraceResult`](FlatCallTraceResult.md) : `TTracer` *extends* `"muxTracer"` ? [`MuxTraceResult`](MuxTraceResult.md) : [`TraceResult`](TraceResult.md)

Defined in: [packages/actions/src/debug/DebugResult.ts:49](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L49)

Result from `debug_traceCall`

## Type Parameters

### TTracer

`TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined` = `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined`

### TDiffMode

`TDiffMode` *extends* `boolean` = `boolean`
