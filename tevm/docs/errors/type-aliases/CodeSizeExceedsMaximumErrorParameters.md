[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [errors](../README.md) / CodeSizeExceedsMaximumErrorParameters

# Type Alias: CodeSizeExceedsMaximumErrorParameters

> **CodeSizeExceedsMaximumErrorParameters**: `object`

Parameters for constructing a [CodeSizeExceedsMaximumError](../classes/CodeSizeExceedsMaximumError.md).

## Type declaration

### cause?

> `optional` **cause**: [`GasLimitExceededError`](../classes/GasLimitExceededError.md) \| `EvmError`

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

packages/errors/types/ethereum/ethereumjs/CodeSizeExceedsMaximumError.d.ts:90
