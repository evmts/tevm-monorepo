[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [errors](../README.md) / InternalErrorParameters

# Type alias: InternalErrorParameters

> **InternalErrorParameters**: `object`

Parameters for constructing an InternalError.

## Type declaration

### cause?

> `optional` **cause**: [`BaseError`](../classes/BaseError.md) \| `Error` \| `unknown`

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

packages/errors/types/ethereum/InternalErrorError.d.ts:54
