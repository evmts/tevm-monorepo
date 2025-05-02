[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceCallResult

# Type Alias: DebugTraceCallResult\<TTracer, TDiffMode\>

> **DebugTraceCallResult**\<`TTracer`, `TDiffMode`\>: `TTracer` *extends* `"callTracer"` ? [`TraceResult`](TraceResult.md) : `TTracer` *extends* `"prestateTracer"` ? [`PrestateTraceAnyResult`](PrestateTraceAnyResult.md)\<`TDiffMode`\> : [`TraceResult`](TraceResult.md)

Defined in: [packages/actions/src/debug/DebugResult.ts:85](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L85)

Result from `debug_traceCall`

## Type Parameters

• **TTracer** *extends* `"callTracer"` \| `"prestateTracer"` = `"callTracer"` \| `"prestateTracer"`

• **TDiffMode** *extends* `boolean` = `boolean`
