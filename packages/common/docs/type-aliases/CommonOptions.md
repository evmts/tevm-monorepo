**@tevm/common** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > CommonOptions

# Type alias: CommonOptions

> **CommonOptions**: `object`

Options for creating an Tevm MemoryClient instance

## Type declaration

### chainId

> **chainId**: `bigint`

The network chain id

### eips

> **eips**?: `ReadonlyArray`\<`number`\>

Eips to enable. Defaults to `[1559, 4895]`

### hardfork

> **hardfork**: [`Hardfork`](Hardfork.md)

Hardfork to use. Defaults to `shanghai`

### loggingLevel

> **loggingLevel**: `LogOptions`[`"level"`]

Tevm logger instance

## Source

[packages/common/src/CommonOptions.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/CommonOptions.ts#L7)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
