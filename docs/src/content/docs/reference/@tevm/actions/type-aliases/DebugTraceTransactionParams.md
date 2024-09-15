---
editUrl: false
next: false
prev: false
title: "DebugTraceTransactionParams"
---

> **DebugTraceTransactionParams**\<`TThrowOnError`\>: [`BaseParams`](/reference/tevm/actions/type-aliases/baseparams/)\<`TThrowOnError`\> & [`TraceParams`](/reference/tevm/actions/type-aliases/traceparams/) & `object`

Params taken by `debug_traceTransaction` handler

## Type declaration

### transactionHash

> `readonly` **transactionHash**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

The transaction hash

## Type Parameters

• **TThrowOnError** *extends* `boolean` = `boolean`

## Defined in

[packages/actions/src/debug/DebugParams.ts:46](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/actions/src/debug/DebugParams.ts#L46)
