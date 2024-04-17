---
editUrl: false
next: false
prev: false
title: "BlockOverrideSet"
---

> **BlockOverrideSet**: `object`

The fields of this optional object customize the block as part of which the call is simulated. The object contains the following fields:
This option cannot be used when `createTransaction` is set to `true`
Setting the block number to past block will not run in the context of that blocks state. To do that fork that block number first.

## Type declaration

### baseFee?

> **`optional`** **baseFee**: `bigint`

Block base fee (see EIP-1559)

### blobBaseFee?

> **`optional`** **blobBaseFee**: `bigint`

Block blob base fee (see EIP-4844)

### coinbase?

> **`optional`** **coinbase**: [`Address`](/reference/utils/type-aliases/address/)

Block fee recipient

### gasLimit?

> **`optional`** **gasLimit**: `bigint`

Block gas capacity

### number?

> **`optional`** **number**: `bigint`

Fake block number

### time?

> **`optional`** **time**: `bigint`

Fake block timestamp

## Source

[common/BlockOverrideSet.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/common/BlockOverrideSet.ts#L8)
