[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [errors](../README.md) / InvalidJumpErrorParameters

# Type Alias: InvalidJumpErrorParameters

> **InvalidJumpErrorParameters**: `object`

Defined in: packages/errors/types/ethereum/ethereumjs/InvalidJumpError.d.ts:76

Parameters for constructing a [InvalidJumpError](../classes/InvalidJumpError.md).

## Type declaration

### cause?

> `optional` **cause**: [`ExecutionError`](../classes/ExecutionError.md) \| [`EvmError`](../../evm/classes/EvmError.md)

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
