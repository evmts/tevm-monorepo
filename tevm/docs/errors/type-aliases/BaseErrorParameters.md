[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [errors](../README.md) / BaseErrorParameters

# Type Alias: BaseErrorParameters

> **BaseErrorParameters**: `object`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:73

## Type declaration

### cause?

> `optional` **cause**: [`BaseError`](../classes/BaseError.md) \| `Error` \| [`EvmError`](../../evm/classes/EvmError.md) \| `unknown`

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

### metaMessages?

> `optional` **metaMessages**: `string`[]

- Additional meta messages.
