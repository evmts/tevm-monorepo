[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [errors](../README.md) / InvalidInputLengthErrorParameters

# Type Alias: InvalidInputLengthErrorParameters

> **InvalidInputLengthErrorParameters**: `object`

Parameters for constructing a [InvalidInputLengthError](../classes/InvalidInputLengthError.md).

## Type declaration

### cause?

> `optional` **cause**: [`ExecutionError`](../classes/ExecutionError.md) \| `EvmError`

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

packages/errors/types/ethereum/ethereumjs/InvalidInputLengthError.d.ts:67
