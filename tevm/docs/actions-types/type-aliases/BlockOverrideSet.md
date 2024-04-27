**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [actions-types](../README.md) > BlockOverrideSet

# Type alias: BlockOverrideSet

> **BlockOverrideSet**: `object`

The fields of this optional object customize the block as part of which the call is simulated. The object contains the following fields:
This option cannot be used when `createTransaction` is set to `true`
Setting the block number to past block will not run in the context of that blocks state. To do that fork that block number first.

## Type declaration

### baseFee

> **baseFee**?: `bigint`

Block base fee (see EIP-1559)

### blobBaseFee

> **blobBaseFee**?: `bigint`

Block blob base fee (see EIP-4844)

### coinbase

> **coinbase**?: [`Address`](../../index/type-aliases/Address.md)

Block fee recipient

### gasLimit

> **gasLimit**?: `bigint`

Block gas capacity

### number

> **number**?: `bigint`

Fake block number

### time

> **time**?: `bigint`

Fake block timestamp

## Source

packages/actions-types/types/common/BlockOverrideSet.d.ts:7

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
