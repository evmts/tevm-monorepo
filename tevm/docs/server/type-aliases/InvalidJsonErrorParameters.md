[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [server](../README.md) / InvalidJsonErrorParameters

# Type Alias: InvalidJsonErrorParameters

> **InvalidJsonErrorParameters** = `object`

Defined in: packages/server/types/errors/InvalidJsonError.d.ts:49

Parameters for constructing an [InvalidJsonError](../classes/InvalidJsonError.md).

## Properties

### cause?

> `optional` **cause**: [`BaseError`](../../errors/classes/BaseError.md) \| `Error`

Defined in: packages/server/types/errors/InvalidJsonError.d.ts:69

- The cause of the error.

***

### details?

> `optional` **details**: `string`

Defined in: packages/server/types/errors/InvalidJsonError.d.ts:73

- Details of the error.

***

### docsBaseUrl?

> `optional` **docsBaseUrl**: `string`

Defined in: packages/server/types/errors/InvalidJsonError.d.ts:53

- Base URL for the documentation.

***

### docsPath?

> `optional` **docsPath**: `string`

Defined in: packages/server/types/errors/InvalidJsonError.d.ts:57

- Path to the documentation.

***

### docsSlug?

> `optional` **docsSlug**: `string`

Defined in: packages/server/types/errors/InvalidJsonError.d.ts:61

- Slug for the documentation.

***

### meta?

> `optional` **meta**: `object`

Defined in: packages/server/types/errors/InvalidJsonError.d.ts:77

- Optional object containing additional information about the error.

***

### metaMessages?

> `optional` **metaMessages**: `string`[]

Defined in: packages/server/types/errors/InvalidJsonError.d.ts:65

- Additional meta messages.
