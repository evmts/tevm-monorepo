[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceTransactionParams

# Type Alias: DebugTraceTransactionParams\<TTracer, TDiffMode, TTTThrowOnError\>

> **DebugTraceTransactionParams**\<`TTracer`, `TDiffMode`, `TTTThrowOnError`\> = [`BaseParams`](../../index/type-aliases/BaseParams.md)\<`TTTThrowOnError`\> & [`TraceParams`](TraceParams.md)\<`TTracer`, `TDiffMode`\> & `object`

Params taken by `debug_traceTransaction` handler

## Type Declaration

### transactionHash

> `readonly` **transactionHash**: [`Hex`](Hex.md)

The transaction hash

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TTracer` *extends* `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined` | `"callTracer"` \| `"prestateTracer"` \| `"4byteTracer"` \| `"flatCallTracer"` \| `"muxTracer"` \| `undefined` |
| `TDiffMode` *extends* `boolean` | `boolean` |
| `TTTThrowOnError` *extends* `boolean` | `boolean` |
