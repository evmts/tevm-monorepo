[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [errors](../README.md) / MisconfiguredClientErrorParameters

# Type Alias: MisconfiguredClientErrorParameters

> **MisconfiguredClientErrorParameters** = `object`

Defined in: packages/errors/types/client/MisconfiguredClient.d.ts:57

Parameters for constructing a [MisconfiguredClientError](../classes/MisconfiguredClientError.md).

## Properties

### cause?

> `optional` **cause**: [`InternalError`](../classes/InternalError.md) \| [`EVMError`](../../evm/classes/EVMError.md)

Defined in: packages/errors/types/client/MisconfiguredClient.d.ts:77

- The cause of the error.

***

### details?

> `optional` **details**: `string`

Defined in: packages/errors/types/client/MisconfiguredClient.d.ts:81

- Details of the error.

***

### docsBaseUrl?

> `optional` **docsBaseUrl**: `string`

Defined in: packages/errors/types/client/MisconfiguredClient.d.ts:61

- Base URL for the documentation.

***

### docsPath?

> `optional` **docsPath**: `string`

Defined in: packages/errors/types/client/MisconfiguredClient.d.ts:65

- Path to the documentation.

***

### docsSlug?

> `optional` **docsSlug**: `string`

Defined in: packages/errors/types/client/MisconfiguredClient.d.ts:69

- Slug for the documentation.

***

### meta?

> `optional` **meta**: `object`

Defined in: packages/errors/types/client/MisconfiguredClient.d.ts:85

- Optional object containing additional information about the error.

***

### metaMessages?

> `optional` **metaMessages**: `string`[]

Defined in: packages/errors/types/client/MisconfiguredClient.d.ts:73

- Additional meta messages.
