**@tevm/actions-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > BlockOverrideSet

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

> **coinbase**?: `Address`

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

[common/BlockOverrideSet.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/common/BlockOverrideSet.ts#L8)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
