[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [server](../README.md) / ReadRequestBodyErrorParameters

# Type Alias: ReadRequestBodyErrorParameters

> **ReadRequestBodyErrorParameters** = `object`

Defined in: packages/server/types/errors/ReadRequestBodyError.d.ts:38

Parameters for constructing a [ReadRequestBodyError](../classes/ReadRequestBodyError.md).

## Properties

### cause?

> `optional` **cause**: [`BaseError`](../../errors/classes/BaseError.md) \| `Error`

Defined in: packages/server/types/errors/ReadRequestBodyError.d.ts:58

- The cause of the error.

***

### details?

> `optional` **details**: `string`

Defined in: packages/server/types/errors/ReadRequestBodyError.d.ts:62

- Details of the error.

***

### docsBaseUrl?

> `optional` **docsBaseUrl**: `string`

Defined in: packages/server/types/errors/ReadRequestBodyError.d.ts:42

- Base URL for the documentation.

***

### docsPath?

> `optional` **docsPath**: `string`

Defined in: packages/server/types/errors/ReadRequestBodyError.d.ts:46

- Path to the documentation.

***

### docsSlug?

> `optional` **docsSlug**: `string`

Defined in: packages/server/types/errors/ReadRequestBodyError.d.ts:50

- Slug for the documentation.

***

### meta?

> `optional` **meta**: `object`

Defined in: packages/server/types/errors/ReadRequestBodyError.d.ts:66

- Optional object containing additional information about the error.

***

### metaMessages?

> `optional` **metaMessages**: `string`[]

Defined in: packages/server/types/errors/ReadRequestBodyError.d.ts:54

- Additional meta messages.
