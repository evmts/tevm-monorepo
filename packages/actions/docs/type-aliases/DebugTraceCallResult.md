[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceCallResult

# Type Alias: DebugTraceCallResult\<TTracer, TDiffMode\>

> **DebugTraceCallResult**\<`TTracer`, `TDiffMode`\> = `TTracer` *extends* `"callTracer"` ? [`CallTraceResult`](CallTraceResult.md) : `TTracer` *extends* `"prestateTracer"` ? [`PrestateTraceResult`](PrestateTraceResult.md)\<`TDiffMode`\> : [`TraceResult`](TraceResult.md)

Defined in: [packages/actions/src/debug/DebugResult.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L29)

Result from `debug_traceCall`

## Type Parameters

### TTracer

`TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `undefined` = `"callTracer"` \| `"prestateTracer"` \| `undefined`

### TDiffMode

`TDiffMode` *extends* `boolean` = `boolean`
