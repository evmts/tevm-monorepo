**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [actions-types](../README.md) > DebugTraceCallParams

# Type alias: DebugTraceCallParams`<TChain>`

> **DebugTraceCallParams**\<`TChain`\>: [`TraceParams`](TraceParams.md) & `object`

Params taken by `debug_traceCall` handler

## Type declaration

### block

> **block**?: `BlockTag` \| [`Hex`](../../index/type-aliases/Hex.md) \| `BigInt`

Block information

### transaction

> **transaction**: `CallParameters`\<`TChain`\>

The transaction to debug

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TChain` extends `Chain` \| `undefined` | `Chain` \| `undefined` |

## Source

packages/actions-types/types/params/DebugParams.d.ts:33

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
