[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceTransactionParams

# Type Alias: DebugTraceTransactionParams\<TTracer, TDiffMode, TTTThrowOnError\>

> **DebugTraceTransactionParams**\<`TTracer`, `TDiffMode`, `TTTThrowOnError`\>: [`BaseParams`](BaseParams.md)\<`TTTThrowOnError`\> & [`TraceParams`](TraceParams.md)\<`TTracer`, `TDiffMode`\> & `object`

Defined in: [packages/actions/src/debug/DebugParams.ts:55](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L55)

Params taken by `debug_traceTransaction` handler

## Type declaration

### transactionHash

> `readonly` **transactionHash**: [`Hex`](Hex.md)

The transaction hash

## Type Parameters

• **TTracer** *extends* `"callTracer"` \| `"prestateTracer"` = `"callTracer"` \| `"prestateTracer"`

• **TDiffMode** *extends* `boolean` = `boolean`

• **TTTThrowOnError** *extends* `boolean` = `boolean`
