[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [errors](../README.md) / UnreachableCodeErrorParameters

# Type Alias: UnreachableCodeErrorParameters

> **UnreachableCodeErrorParameters**: `object`

Defined in: packages/errors/types/defensive/UnreachableCodeError.d.ts:67

Parameters for constructing a [UnreachableCodeError](../classes/UnreachableCodeError.md).

## Type declaration

### cause?

> `optional` **cause**: [`InternalError`](../classes/InternalError.md) \| [`EvmError`](../../evm/classes/EvmError.md)

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
