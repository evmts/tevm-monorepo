---
editUrl: false
next: false
prev: false
title: "Block"
---

> **Block**: `object`

Header information of an ethereum block

## Type declaration

### baseFeePerGas

> **`readonly`** **baseFeePerGas**?: `bigint`

(Optional) The base fee per gas in the block, introduced in EIP-1559 for dynamic transaction fee calculation.

### blobGasPrice

> **`readonly`** **blobGasPrice**?: `bigint`

The gas price for the block; may be undefined in blocks after EIP-1559.

### coinbase

> **`readonly`** **coinbase**: [`Address`](/reference/tevm/actions-types/type-aliases/address/)

The address of the miner or validator who mined or validated the block.

### difficulty

> **`readonly`** **difficulty**: `bigint`

The difficulty level of the block (relevant in PoW chains).

### gasLimit

> **`readonly`** **gasLimit**: `bigint`

The gas limit for the block, i.e., the maximum amount of gas that can be used by the transactions in the block.

### number

> **`readonly`** **number**: `bigint`

The block number (height) in the blockchain.

### timestamp

> **`readonly`** **timestamp**: `bigint`

The timestamp at which the block was mined or validated.

## Source

[common/Block.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/common/Block.ts#L6)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
