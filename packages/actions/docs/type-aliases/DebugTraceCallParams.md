[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceCallParams

# Type Alias: DebugTraceCallParams\<TTracer, TDiffMode\>

> **DebugTraceCallParams**\<`TTracer`, `TDiffMode`\> = [`TraceParams`](TraceParams.md)\<`TTracer`, `TDiffMode`\> & [`EthCallParams`](EthCallParams.md)

Defined in: [packages/actions/src/debug/DebugParams.ts:79](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L79)

Params taken by `debug_traceCall` handler

## Type Parameters

### TTracer

`TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `undefined` = `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `undefined`

### TDiffMode

`TDiffMode` *extends* `boolean` = `boolean`
