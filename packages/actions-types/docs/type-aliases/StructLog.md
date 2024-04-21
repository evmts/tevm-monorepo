**@tevm/actions-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > StructLog

# Type alias: StructLog

> **StructLog**: `object`

## Type declaration

### depth

> **`readonly`** **depth**: `number`

### error

> **`readonly`** **error**?: `object`

### error.error

> **error.error**: `string`

### error.errorType

> **error.errorType**: `string`

### gas

> **`readonly`** **gas**: `bigint`

### gasCost

> **`readonly`** **gasCost**: `bigint`

### op

> **`readonly`** **op**: `string`

### pc

> **`readonly`** **pc**: `number`

### stack

> **`readonly`** **stack**: `ReadonlyArray`\<[`Hex`](Hex.md)\>

## Source

[result/DebugResult.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/DebugResult.ts#L4)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
