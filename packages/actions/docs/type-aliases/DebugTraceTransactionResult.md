[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceTransactionResult

# Type Alias: DebugTraceTransactionResult\<TTracer, TDiffMode\>

> **DebugTraceTransactionResult**\<`TTracer`, `TDiffMode`\> = `TTracer` *extends* `"callTracer"` ? [`CallTraceResult`](CallTraceResult.md) : `TTracer` *extends* `"prestateTracer"` ? [`PrestateTraceResult`](PrestateTraceResult.md)\<`TDiffMode`\> : `TTracer` *extends* `"4byteTracer"` ? [`FourbyteTraceResult`](FourbyteTraceResult.md) : `TTracer` *extends* `"flatCallTracer"` ? [`FlatCallTraceResult`](FlatCallTraceResult.md) : `TTracer` *extends* `"muxTracer"` ? [`MuxTraceResult`](MuxTraceResult.md) : [`TraceResult`](TraceResult.md)

Defined in: [packages/actions/src/debug/DebugResult.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L25)

Result from `debug_traceTransaction`

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined` | `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined` |
| `TDiffMode` *extends* `boolean` | `boolean` |
