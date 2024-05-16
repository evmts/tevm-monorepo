[**@tevm/common**](../README.md) • **Docs**

***

[@tevm/common](../globals.md) / CommonOptions

# Type alias: CommonOptions

> **CommonOptions**: `object`

Options for creating an Tevm MemoryClient instance

## Type declaration

### chainId

> **chainId**: `bigint`

The network chain id

### eips?

> `optional` **eips**: `ReadonlyArray`\<`number`\>

Eips to enable. Defaults to `[1559, 4895]`

### hardfork

> **hardfork**: [`Hardfork`](Hardfork.md)

Hardfork to use. Defaults to `shanghai`

### loggingLevel

> **loggingLevel**: `LogOptions`\[`"level"`\]

Tevm logger instance

## Source

[packages/common/src/CommonOptions.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/CommonOptions.ts#L7)
