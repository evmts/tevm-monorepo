[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / CommonOptions

# Type alias: CommonOptions

> **CommonOptions**: `object` & `ViemChain`

Options for creating an Tevm MemoryClient instance

## Type declaration

### customCrypto?

> `optional` **customCrypto**: [`CustomCrypto`](../interfaces/CustomCrypto.md)

Custom crypto implementations
For EIP-4844 support kzg must be passed

#### Warning

KZG can add a significant amount of bundle size to an app
In future a stub will be provided that that automatically returns valid without checking the kzg proof

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

packages/common/types/CommonOptions.d.ts:8
