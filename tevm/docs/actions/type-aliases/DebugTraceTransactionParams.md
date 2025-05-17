[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceTransactionParams

# Type Alias: DebugTraceTransactionParams\<TTracer, TDiffMode, TTTThrowOnError\>

> **DebugTraceTransactionParams**\<`TTracer`, `TDiffMode`, `TTTThrowOnError`\> = [`BaseParams`](../../index/type-aliases/BaseParams.md)\<`TTTThrowOnError`\> & [`TraceParams`](TraceParams.md)\<`TTracer`, `TDiffMode`\> & `object`

Defined in: packages/actions/types/debug/DebugParams.d.ts:45

Params taken by `debug_traceTransaction` handler

## Type declaration

### transactionHash

> `readonly` **transactionHash**: [`Hex`](Hex.md)

The transaction hash

## Type Parameters

### TTracer

`TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `undefined` = `"callTracer"` \| `"prestateTracer"` \| `undefined`

### TDiffMode

`TDiffMode` *extends* `boolean` = `boolean`

### TTTThrowOnError

`TTTThrowOnError` *extends* `boolean` = `boolean`
