[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceTransactionParams

# Type Alias: DebugTraceTransactionParams\<TTracer, TDiffMode, TTTThrowOnError\>

> **DebugTraceTransactionParams**\<`TTracer`, `TDiffMode`, `TTTThrowOnError`\> = [`BaseParams`](BaseParams.md)\<`TTTThrowOnError`\> & [`TraceParams`](TraceParams.md)\<`TTracer`, `TDiffMode`\> & `object`

Defined in: [packages/actions/src/debug/DebugParams.ts:59](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L59)

Params taken by `debug_traceTransaction` handler

## Type Declaration

### transactionHash

> `readonly` **transactionHash**: [`Hex`](Hex.md)

The transaction hash

## Type Parameters

### TTracer

`TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `undefined` = `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `undefined`

### TDiffMode

`TDiffMode` *extends* `boolean` = `boolean`

### TTTThrowOnError

`TTTThrowOnError` *extends* `boolean` = `boolean`
