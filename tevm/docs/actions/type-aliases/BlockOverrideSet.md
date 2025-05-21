[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / BlockOverrideSet

# Type Alias: BlockOverrideSet

> **BlockOverrideSet** = `object`

Defined in: packages/actions/types/common/BlockOverrideSet.d.ts:7

The fields of this optional object customize the block as part of which the call is simulated. The object contains the following fields:
This option cannot be used when `createTransaction` is set to `true`
Setting the block number to past block will not run in the context of that blocks state. To do that fork that block number first.

## Properties

### baseFee?

> `optional` **baseFee**: `bigint`

Defined in: packages/actions/types/common/BlockOverrideSet.d.ts:35

Block base fee (see EIP-1559)

***

### blobBaseFee?

> `optional` **blobBaseFee**: `bigint`

Defined in: packages/actions/types/common/BlockOverrideSet.d.ts:39

Block blob base fee (see EIP-4844)

***

### coinbase?

> `optional` **coinbase**: [`Address`](../../index/type-aliases/Address.md)

Defined in: packages/actions/types/common/BlockOverrideSet.d.ts:27

Block fee recipient

***

### gasLimit?

> `optional` **gasLimit**: `bigint`

Defined in: packages/actions/types/common/BlockOverrideSet.d.ts:23

Block gas capacity

***

### number?

> `optional` **number**: `bigint`

Defined in: packages/actions/types/common/BlockOverrideSet.d.ts:11

Fake block number

***

### time?

> `optional` **time**: `bigint`

Defined in: packages/actions/types/common/BlockOverrideSet.d.ts:19

Fake block timestamp
