**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [actions-types](../README.md) > DebugTraceTransactionParams

# Type alias: DebugTraceTransactionParams`<TThrowOnError>`

> **DebugTraceTransactionParams**\<`TThrowOnError`\>: `BaseParams`\<`TThrowOnError`\> & [`TraceParams`](../../index/type-aliases/TraceParams.md) & `object`

Params taken by `debug_traceTransaction` handler

## Type declaration

### transactionHash

> **transactionHash**: [`Hex`](Hex.md)

The transaction hash

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TThrowOnError` extends `boolean` | `boolean` |

## Source

packages/actions-types/types/params/DebugParams.d.ts:26

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
