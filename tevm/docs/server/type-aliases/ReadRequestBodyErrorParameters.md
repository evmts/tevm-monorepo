[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [server](../README.md) / ReadRequestBodyErrorParameters

# Type Alias: ReadRequestBodyErrorParameters

> **ReadRequestBodyErrorParameters**: `object`

Defined in: packages/server/types/errors/ReadRequestBodyError.d.ts:38

Parameters for constructing a [ReadRequestBodyError](../classes/ReadRequestBodyError.md).

## Type declaration

### cause?

> `optional` **cause**: [`BaseError`](../../errors/classes/BaseError.md) \| `Error`

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
