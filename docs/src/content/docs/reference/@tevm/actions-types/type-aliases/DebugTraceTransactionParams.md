---
editUrl: false
next: false
prev: false
title: "DebugTraceTransactionParams"
---

> **DebugTraceTransactionParams**\<`TThrowOnError`\>: `BaseParams`\<`TThrowOnError`\> & [`TraceParams`](/reference/tevm/actions-types/type-aliases/traceparams/) & `object`

Params taken by `debug_traceTransaction` handler

## Type declaration

### transactionHash

> **transactionHash**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

The transaction hash

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TThrowOnError` extends `boolean` | `boolean` |

## Source

[params/DebugParams.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/DebugParams.ts#L46)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
