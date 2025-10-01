[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [errors](../README.md) / ExecutionErrorParameters

# Type Alias: ExecutionErrorParameters

> **ExecutionErrorParameters** = `object`

Defined in: packages/errors/types/ethereum/ExecutionErrorError.d.ts:56

Parameters for constructing an ExecutionError.

## Properties

### cause?

> `optional` **cause**: [`BaseError`](../classes/BaseError.md) \| [`EVMError`](../../evm/classes/EVMError.md)

Defined in: packages/errors/types/ethereum/ExecutionErrorError.d.ts:76

- The cause of the error.

***

### details?

> `optional` **details**: `string`

Defined in: packages/errors/types/ethereum/ExecutionErrorError.d.ts:80

- Details of the error.

***

### docsBaseUrl?

> `optional` **docsBaseUrl**: `string`

Defined in: packages/errors/types/ethereum/ExecutionErrorError.d.ts:60

- Base URL for the documentation.

***

### docsPath?

> `optional` **docsPath**: `string`

Defined in: packages/errors/types/ethereum/ExecutionErrorError.d.ts:64

- Path to the documentation.

***

### docsSlug?

> `optional` **docsSlug**: `string`

Defined in: packages/errors/types/ethereum/ExecutionErrorError.d.ts:68

- Slug for the documentation.

***

### meta?

> `optional` **meta**: `object`

Defined in: packages/errors/types/ethereum/ExecutionErrorError.d.ts:84

- Optional object containing additional information about the error.

***

### metaMessages?

> `optional` **metaMessages**: `string`[]

Defined in: packages/errors/types/ethereum/ExecutionErrorError.d.ts:72

- Additional meta messages.
