[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [errors](../README.md) / ExecutionErrorParameters

# Type Alias: ExecutionErrorParameters

> **ExecutionErrorParameters** = `object`

Defined in: packages/errors/types/ethereum/ExecutionErrorError.d.ts:55

Parameters for constructing an ExecutionError.

## Properties

### cause?

> `optional` **cause**: [`BaseError`](../classes/BaseError.md) \| [`EVMError`](../../evm/classes/EVMError.md)

Defined in: packages/errors/types/ethereum/ExecutionErrorError.d.ts:75

- The cause of the error.

***

### details?

> `optional` **details**: `string`

Defined in: packages/errors/types/ethereum/ExecutionErrorError.d.ts:79

- Details of the error.

***

### docsBaseUrl?

> `optional` **docsBaseUrl**: `string`

Defined in: packages/errors/types/ethereum/ExecutionErrorError.d.ts:59

- Base URL for the documentation.

***

### docsPath?

> `optional` **docsPath**: `string`

Defined in: packages/errors/types/ethereum/ExecutionErrorError.d.ts:63

- Path to the documentation.

***

### docsSlug?

> `optional` **docsSlug**: `string`

Defined in: packages/errors/types/ethereum/ExecutionErrorError.d.ts:67

- Slug for the documentation.

***

### meta?

> `optional` **meta**: `object`

Defined in: packages/errors/types/ethereum/ExecutionErrorError.d.ts:83

- Optional object containing additional information about the error.

***

### metaMessages?

> `optional` **metaMessages**: `string`[]

Defined in: packages/errors/types/ethereum/ExecutionErrorError.d.ts:71

- Additional meta messages.
