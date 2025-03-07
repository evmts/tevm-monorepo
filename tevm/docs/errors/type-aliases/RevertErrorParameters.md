[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [errors](../README.md) / RevertErrorParameters

# Type Alias: RevertErrorParameters

> **RevertErrorParameters**: `object`

Defined in: packages/errors/types/ethereum/RevertError.d.ts:64

Parameters for constructing a RevertError.

## Type declaration

### cause?

> `optional` **cause**: [`EvmError`](../../evm/classes/EvmError.md) \| [`BaseError`](../classes/BaseError.md) \| `Error`

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
