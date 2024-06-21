[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [errors](../README.md) / EvmRevertErrorParameters

# Type alias: EvmRevertErrorParameters

> **EvmRevertErrorParameters**: `object`

Parameters for constructing a [EvmRevertError](../classes/EvmRevertError.md).

## Type declaration

### cause?

> `optional` **cause**: `EvmError`

- The cause of the error. From running ethereumjs EVM.runCall

### details?

> `optional` **details**: `string`

- Details of the error.

### docsBaseUrl?

> `optional` **docsBaseUrl**: `string`

- Base URL for the documentation.

### docsPath?

> `optional` **docsPath**: `string`

- Path to the documentation.

### docsSlug?

> `optional` **docsSlug**: `string`

- Slug for the documentation.

### meta?

> `optional` **meta**: `object`

- Optional object containing additional information about the error.

### metaMessages?

> `optional` **metaMessages**: `string`[]

- Additional meta messages.

## Source

packages/errors/types/ethereum/ethereumjs/EvmRevertError.d.ts:79
