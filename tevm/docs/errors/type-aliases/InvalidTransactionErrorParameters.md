[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [errors](../README.md) / InvalidTransactionErrorParameters

# Type alias: InvalidTransactionErrorParameters

> **InvalidTransactionErrorParameters**: `object`

Parameters for constructing an InvalidTransactionError.

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

## Source

packages/errors/types/ethereum/InvalidTransactionError.d.ts:50
