[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / BlockOverrideSet

# Type Alias: BlockOverrideSet

> **BlockOverrideSet**: `object`

Defined in: packages/actions/types/common/BlockOverrideSet.d.ts:7

The fields of this optional object customize the block as part of which the call is simulated. The object contains the following fields:
This option cannot be used when `createTransaction` is set to `true`
Setting the block number to past block will not run in the context of that blocks state. To do that fork that block number first.

## Type declaration

### baseFee?

> `optional` **baseFee**: `bigint`

Block base fee (see EIP-1559)

### blobBaseFee?

> `optional` **blobBaseFee**: `bigint`

Block blob base fee (see EIP-4844)

### coinbase?

> `optional` **coinbase**: [`Address`](../../index/type-aliases/Address.md)

Block fee recipient

### gasLimit?

> `optional` **gasLimit**: `bigint`

Block gas capacity

### number?

> `optional` **number**: `bigint`

Fake block number

### time?

> `optional` **time**: `bigint`

Fake block timestamp
