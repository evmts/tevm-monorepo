**@tevm/viem** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > GenResult

# Type alias: GenResult`<TDataType, TTag>`

> **GenResult**\<`TDataType`, `TTag`\>: `object`

A result type for a single yield of writeContractOptimistic

## Type parameters

| Parameter |
| :------ |
| `TDataType` |
| `TTag` extends `string` |

## Type declaration

### data

> **data**: `TDataType`

### errors

> **errors**?: `ReadonlyArray`\<[`TypedError`](TypedError.md)\<`string`\>\>

### success

> **success**: `true`

### tag

> **tag**: `TTag`

## Source

[GenResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenResult.ts#L7)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
