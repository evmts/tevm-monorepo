[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceTransactionResult

# Type Alias: DebugTraceTransactionResult\<TTracer, TDiffMode\>

> **DebugTraceTransactionResult**\<`TTracer`, `TDiffMode`\>: `TTracer` *extends* `"callTracer"` ? [`TraceResult`](TraceResult.md) : `TTracer` *extends* `"prestateTracer"` ? [`PrestateTraceAnyResult`](PrestateTraceAnyResult.md)\<`TDiffMode`\> : [`TraceResult`](TraceResult.md)

Defined in: [packages/actions/src/debug/DebugResult.ts:73](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L73)

Result from `debug_traceTransaction`

## Type Parameters

• **TTracer** *extends* `"callTracer"` \| `"prestateTracer"` = `"callTracer"` \| `"prestateTracer"`

• **TDiffMode** *extends* `boolean` = `boolean`
