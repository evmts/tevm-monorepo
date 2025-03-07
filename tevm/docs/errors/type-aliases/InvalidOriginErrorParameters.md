[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [errors](../README.md) / InvalidOriginErrorParameters

# Type Alias: InvalidOriginErrorParameters

> **InvalidOriginErrorParameters**: `object`

Defined in: packages/errors/types/input/InvalidOriginError.d.ts:42

Parameters for constructing an InvalidOriginError.

## Type declaration

### cause?

> `optional` **cause**: [`BaseError`](../classes/BaseError.md) \| `Error`

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
