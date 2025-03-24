[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceTransactionParams

# Type Alias: DebugTraceTransactionParams\<TThrowOnError\>

> **DebugTraceTransactionParams**\<`TThrowOnError`\> = [`BaseParams`](../../index/type-aliases/BaseParams.md)\<`TThrowOnError`\> & [`TraceParams`](TraceParams.md) & `object`

Defined in: packages/actions/types/debug/DebugParams.d.ts:26

Params taken by `debug_traceTransaction` handler

## Type declaration

### transactionHash

> `readonly` **transactionHash**: [`Hex`](Hex.md)

The transaction hash

## Type Parameters

### TThrowOnError

`TThrowOnError` *extends* `boolean` = `boolean`
