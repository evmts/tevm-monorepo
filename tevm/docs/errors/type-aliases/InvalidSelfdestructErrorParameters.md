[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [errors](../README.md) / InvalidSelfdestructErrorParameters

# Type Alias: InvalidSelfdestructErrorParameters

> **InvalidSelfdestructErrorParameters**: `object`

Defined in: packages/errors/types/input/InvalidSelfdestructError.d.ts:51

Parameters for constructing an InvalidSelfdestructError.

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
