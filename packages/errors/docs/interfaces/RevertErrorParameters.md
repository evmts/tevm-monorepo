[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / RevertErrorParameters

# Interface: RevertErrorParameters

## Properties

### cause?

> `optional` **cause**: [`BaseError`](../classes/BaseError.md) \| `Error` \| `EVMError`

The cause of the error.

***

### details?

> `optional` **details**: `string`

Details of the error.

***

### docsBaseUrl?

> `optional` **docsBaseUrl**: `string`

Base URL for the documentation.

***

### docsPath?

> `optional` **docsPath**: `string`

Path to the documentation.

***

### docsSlug?

> `optional` **docsSlug**: `string`

Slug for the documentation.

***

### meta?

> `optional` **meta**: `object`

Optional object containing additional information about the error.

***

### metaMessages?

> `optional` **metaMessages**: `string`[]

Additional meta messages.

***

### raw?

> `optional` **raw**: `` `0x${string}` ``

The raw data of the revert.
