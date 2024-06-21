[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [errors](../README.md) / ForkErrorParameters

# Type alias: ForkErrorParameters

> **ForkErrorParameters**: `object`

Parameters for constructing an ForkError.

## Type declaration

### cause

> **cause**: [`BaseError`](../classes/BaseError.md) \| `Error` \| `object`

- The cause of the error.

### details?

> `optional` **details**: `string`

- Details of the error.

### docsBaseUrl?

> `optional` **docsBaseUrl**: `string`

- Base URL for the documentation.

### docsPath?

> `optional` **docsPath**: `string`

- Path to the documentation.

### docsSlug?

> `optional` **docsSlug**: `string`

- Slug for the documentation.

### meta?

> `optional` **meta**: `object`

- Optional object containing additional information about the error.

### metaMessages?

> `optional` **metaMessages**: `string`[]

- Additional meta messages.

## Source

packages/errors/types/fork/ForkError.d.ts:67
