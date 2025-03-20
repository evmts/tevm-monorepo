[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceTransactionParams

# Type Alias: DebugTraceTransactionParams\<TThrowOnError\>

> **DebugTraceTransactionParams**\<`TThrowOnError`\>: [`BaseParams`](BaseParams.md)\<`TThrowOnError`\> & [`TraceParams`](TraceParams.md) & `object`

Defined in: [packages/actions/src/debug/DebugParams.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L51)

Params taken by `debug_traceTransaction` handler

## Type declaration

### transactionHash

> `readonly` **transactionHash**: [`Hex`](Hex.md)

The transaction hash

## Type Parameters

• **TThrowOnError** *extends* `boolean` = `boolean`
