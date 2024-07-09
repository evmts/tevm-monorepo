[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [server](../README.md) / InvalidJsonErrorParameters

# Type Alias: InvalidJsonErrorParameters

> **InvalidJsonErrorParameters**: `object`

Parameters for constructing an [InvalidJsonError](../classes/InvalidJsonError.md).

## Type declaration

### cause?

> `optional` **cause**: `BaseError` \| `Error`

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

## Defined in

packages/server/types/errors/InvalidJsonError.d.ts:49
