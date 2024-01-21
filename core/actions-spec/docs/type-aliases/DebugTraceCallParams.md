**@tevm/actions-spec** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > DebugTraceCallParams

# Type alias: DebugTraceCallParams`<TChain>`

> **DebugTraceCallParams**\<`TChain`\>: [`TraceParams`](TraceParams.md) & `object`

Params taken by `debug_traceCall` handler

## Type declaration

### block

> **block**?: `BlockTag` \| `Hex` \| `BigInt`

Block information

### transaction

> **transaction**: `CallParameters`\<`TChain`\>

The transaction to debug

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TChain` extends `Chain` \| `undefined` | `Chain` \| `undefined` |

## Source

[params/DebugParams.ts:55](https://github.com/evmts/tevm-monorepo/blob/main/core/actions-spec/src/params/DebugParams.ts#L55)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
