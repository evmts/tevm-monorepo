[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceCallParams

# Type Alias: DebugTraceCallParams\<TTracer, TDiffMode\>

> **DebugTraceCallParams**\<`TTracer`, `TDiffMode`\>: [`TraceParams`](TraceParams.md)\<`TTracer`, `TDiffMode`\> & [`EthCallParams`](EthCallParams.md)

Defined in: [packages/actions/src/debug/DebugParams.ts:71](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L71)

Params taken by `debug_traceCall` handler

## Type Parameters

• **TTracer** *extends* `"callTracer"` \| `"prestateTracer"` \| `undefined` = `"callTracer"` \| `"prestateTracer"` \| `undefined`

• **TDiffMode** *extends* `boolean` = `boolean`
