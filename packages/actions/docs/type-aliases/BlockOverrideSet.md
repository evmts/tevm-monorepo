[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / BlockOverrideSet

# Type Alias: BlockOverrideSet

> **BlockOverrideSet** = `object`

Defined in: [packages/actions/src/common/BlockOverrideSet.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockOverrideSet.ts#L8)

The fields of this optional object customize the block as part of which the call is simulated. The object contains the following fields:
This option cannot be used when `createTransaction` is set to `true`
Setting the block number to past block will not run in the context of that blocks state. To do that fork that block number first.

## Properties

### baseFee?

> `optional` **baseFee**: `bigint`

Defined in: [packages/actions/src/common/BlockOverrideSet.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockOverrideSet.ts#L38)

Block base fee (see EIP-1559)

***

### blobBaseFee?

> `optional` **blobBaseFee**: `bigint`

Defined in: [packages/actions/src/common/BlockOverrideSet.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockOverrideSet.ts#L42)

Block blob base fee (see EIP-4844)

***

### coinbase?

> `optional` **coinbase**: `Address`

Defined in: [packages/actions/src/common/BlockOverrideSet.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockOverrideSet.ts#L29)

Block fee recipient

***

### gasLimit?

> `optional` **gasLimit**: `bigint`

Defined in: [packages/actions/src/common/BlockOverrideSet.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockOverrideSet.ts#L25)

Block gas capacity

***

### number?

> `optional` **number**: `bigint`

Defined in: [packages/actions/src/common/BlockOverrideSet.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockOverrideSet.ts#L12)

Fake block number

***

### time?

> `optional` **time**: `bigint`

Defined in: [packages/actions/src/common/BlockOverrideSet.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockOverrideSet.ts#L21)

Fake block timestamp
