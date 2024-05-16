[**@tevm/actions-types**](../README.md) • **Docs**

***

[@tevm/actions-types](../globals.md) / DebugTraceTransactionParams

# Type alias: DebugTraceTransactionParams\<TThrowOnError\>

> **DebugTraceTransactionParams**\<`TThrowOnError`\>: `BaseParams`\<`TThrowOnError`\> & [`TraceParams`](TraceParams.md) & `object`

Params taken by `debug_traceTransaction` handler

## Type declaration

### transactionHash

> **transactionHash**: [`Hex`](Hex.md)

The transaction hash

## Type parameters

• **TThrowOnError** *extends* `boolean` = `boolean`

## Source

[params/DebugParams.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/DebugParams.ts#L46)
