[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [errors](../README.md) / RevertErrorParameters

# Type Alias: RevertErrorParameters

> **RevertErrorParameters** = `object`

Defined in: tevm-monorepo/packages/errors/types/ethereum/RevertError.d.ts:67

Parameters for constructing a RevertError.

## Properties

### cause?

> `optional` **cause?**: `EVMError` \| [`BaseError`](../classes/BaseError.md) \| `Error`

Defined in: tevm-monorepo/packages/errors/types/ethereum/RevertError.d.ts:87

- The cause of the error.

***

### details?

> `optional` **details?**: `string`

Defined in: tevm-monorepo/packages/errors/types/ethereum/RevertError.d.ts:91

- Details of the error.

***

### docsBaseUrl?

> `optional` **docsBaseUrl?**: `string`

Defined in: tevm-monorepo/packages/errors/types/ethereum/RevertError.d.ts:71

- Base URL for the documentation.

***

### docsPath?

> `optional` **docsPath?**: `string`

Defined in: tevm-monorepo/packages/errors/types/ethereum/RevertError.d.ts:75

- Path to the documentation.

***

### docsSlug?

> `optional` **docsSlug?**: `string`

Defined in: tevm-monorepo/packages/errors/types/ethereum/RevertError.d.ts:79

- Slug for the documentation.

***

### meta?

> `optional` **meta?**: `object`

Defined in: tevm-monorepo/packages/errors/types/ethereum/RevertError.d.ts:95

- Optional object containing additional information about the error.

***

### metaMessages?

> `optional` **metaMessages?**: `string`[]

Defined in: tevm-monorepo/packages/errors/types/ethereum/RevertError.d.ts:83

- Additional meta messages.

***

### raw?

> `optional` **raw?**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: tevm-monorepo/packages/errors/types/ethereum/RevertError.d.ts:99

- The raw data of the revert.
