**@tevm/viem** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > GenError

# Type alias: GenError`<TErrorType, TTag>`

> **GenError**\<`TErrorType`, `TTag`\>: `object`

An error yield of writeContractOptimistic
Errors are yielded rather than throwing

## Type parameters

| Parameter |
| :------ |
| `TErrorType` |
| `TTag` extends `string` |

## Type declaration

### error

> **error**: `TErrorType`

### errors

> **errors**?: `ReadonlyArray`\<[`TypedError`](TypedError.md)\<`string`\>\>

### success

> **success**: `false`

### tag

> **tag**: `TTag`

## Source

[extensions/viem/src/GenError.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenError.ts#L7)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
