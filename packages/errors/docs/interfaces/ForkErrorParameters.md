[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / ForkErrorParameters

# Interface: ForkErrorParameters

Defined in: packages/errors/src/fork/ForkError.js:7

## Properties

### cause

> **cause**: [`BaseError`](../classes/BaseError.md) \| `Error` \| \{ `code`: `string` \| `number`; `message`: `string`; \}

Defined in: packages/errors/src/fork/ForkError.js:12

The cause of the error.

***

### details?

> `optional` **details**: `string`

Defined in: packages/errors/src/fork/ForkError.js:13

Details of the error.

***

### docsBaseUrl?

> `optional` **docsBaseUrl**: `string`

Defined in: packages/errors/src/fork/ForkError.js:8

Base URL for the documentation.

***

### docsPath?

> `optional` **docsPath**: `string`

Defined in: packages/errors/src/fork/ForkError.js:9

Path to the documentation.

***

### docsSlug?

> `optional` **docsSlug**: `string`

Defined in: packages/errors/src/fork/ForkError.js:10

Slug for the documentation.

***

### meta?

> `optional` **meta**: `object`

Defined in: packages/errors/src/fork/ForkError.js:14

Optional object containing additional information about the error.

***

### metaMessages?

> `optional` **metaMessages**: `string`[]

Defined in: packages/errors/src/fork/ForkError.js:11

Additional meta messages.
