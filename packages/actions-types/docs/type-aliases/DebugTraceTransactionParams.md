**@tevm/actions-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > DebugTraceTransactionParams

# Type alias: DebugTraceTransactionParams`<TThrowOnError>`

> **DebugTraceTransactionParams**\<`TThrowOnError`\>: `BaseParams`\<`TThrowOnError`\> & [`TraceParams`](TraceParams.md) & `object`

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

[params/DebugParams.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/DebugParams.ts#L46)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
