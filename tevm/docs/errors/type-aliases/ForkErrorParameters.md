[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [errors](../README.md) / ForkErrorParameters

# Type Alias: ForkErrorParameters

> **ForkErrorParameters** = `object`

Defined in: packages/errors/types/fork/ForkError.d.ts:54

Parameters for constructing a ForkError.

## Properties

### cause

> **cause**: [`BaseError`](../classes/BaseError.md) \| `Error` \| \{ `code`: `number` \| `string`; `message`: `string`; \}

Defined in: packages/errors/types/fork/ForkError.d.ts:74

- The cause of the error.

***

### details?

> `optional` **details**: `string`

Defined in: packages/errors/types/fork/ForkError.d.ts:81

- Details of the error.

***

### docsBaseUrl?

> `optional` **docsBaseUrl**: `string`

Defined in: packages/errors/types/fork/ForkError.d.ts:58

- Base URL for the documentation.

***

### docsPath?

> `optional` **docsPath**: `string`

Defined in: packages/errors/types/fork/ForkError.d.ts:62

- Path to the documentation.

***

### docsSlug?

> `optional` **docsSlug**: `string`

Defined in: packages/errors/types/fork/ForkError.d.ts:66

- Slug for the documentation.

***

### meta?

> `optional` **meta**: `object`

Defined in: packages/errors/types/fork/ForkError.d.ts:85

- Optional object containing additional information about the error.

***

### metaMessages?

> `optional` **metaMessages**: `string`[]

Defined in: packages/errors/types/fork/ForkError.d.ts:70

- Additional meta messages.
