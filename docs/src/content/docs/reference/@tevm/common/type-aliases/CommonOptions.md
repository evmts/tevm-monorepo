---
editUrl: false
next: false
prev: false
title: "CommonOptions"
---

> **CommonOptions**: `object`

Options for creating an Tevm MemoryClient instance

## Type declaration

### chainId

> **chainId**: `bigint`

The network chain id

### customCrypto?

> `optional` **customCrypto**: [`CustomCrypto`](/reference/tevm/common/interfaces/customcrypto/)

Custom crypto implementations
For EIP-4844 support kzg must be passed

#### Warning

KZG can add a significant amount of bundle size to an app
In future a stub will be provided that that automatically returns valid without checking the kzg proof

### eips?

> `optional` **eips**: `ReadonlyArray`\<`number`\>

Eips to enable. Defaults to `[1559, 4895]`

### hardfork

> **hardfork**: [`Hardfork`](/reference/tevm/common/type-aliases/hardfork/)

Hardfork to use. Defaults to `shanghai`

### loggingLevel

> **loggingLevel**: `LogOptions`\[`"level"`\]

Tevm logger instance

## Source

[packages/common/src/CommonOptions.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/CommonOptions.ts#L8)
