[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [errors](../README.md) / RevertErrorParameters

# Type Alias: RevertErrorParameters

> **RevertErrorParameters** = `object`

Defined in: packages/errors/types/ethereum/RevertError.d.ts:64

Parameters for constructing a RevertError.

## Properties

### cause?

> `optional` **cause**: [`EvmError`](../../evm/classes/EvmError.md) \| [`BaseError`](../classes/BaseError.md) \| `Error`

Defined in: packages/errors/types/ethereum/RevertError.d.ts:84

- The cause of the error.

***

### details?

> `optional` **details**: `string`

Defined in: packages/errors/types/ethereum/RevertError.d.ts:88

- Details of the error.

***

### docsBaseUrl?

> `optional` **docsBaseUrl**: `string`

Defined in: packages/errors/types/ethereum/RevertError.d.ts:68

- Base URL for the documentation.

***

### docsPath?

> `optional` **docsPath**: `string`

Defined in: packages/errors/types/ethereum/RevertError.d.ts:72

- Path to the documentation.

***

### docsSlug?

> `optional` **docsSlug**: `string`

Defined in: packages/errors/types/ethereum/RevertError.d.ts:76

- Slug for the documentation.

***

### meta?

> `optional` **meta**: `object`

Defined in: packages/errors/types/ethereum/RevertError.d.ts:92

- Optional object containing additional information about the error.

***

### metaMessages?

> `optional` **metaMessages**: `string`[]

Defined in: packages/errors/types/ethereum/RevertError.d.ts:80

- Additional meta messages.
