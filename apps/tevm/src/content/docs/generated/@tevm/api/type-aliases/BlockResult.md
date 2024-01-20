---
editUrl: false
next: false
prev: false
title: "BlockResult"
---

> **BlockResult**: `object`

The type returned by block related
json rpc procedures

## Type declaration

### difficulty

> **`readonly`** **difficulty**: `Hex`

### extraData

> **`readonly`** **extraData**: `Hex`

### gasLimit

> **`readonly`** **gasLimit**: `Hex`

### gasUsed

> **`readonly`** **gasUsed**: `Hex`

### hash

> **`readonly`** **hash**: `Hex`

The hex stringhash of the block.

### logsBloom

> **`readonly`** **logsBloom**: `Hex`

### miner

> **`readonly`** **miner**: `Hex`

### nonce

> **`readonly`** **nonce**: `Hex`

### number

> **`readonly`** **number**: `Hex`

The block number (height) in the blockchain.

### parentHash

> **`readonly`** **parentHash**: `Hex`

The hex stringhash of the parent block.

### sha3Uncles

> **`readonly`** **sha3Uncles**: `Hex`

The hex stringhash of the uncles of the block.

### size

> **`readonly`** **size**: `Hex`

### stateRoot

> **`readonly`** **stateRoot**: `Hex`

### timestamp

> **`readonly`** **timestamp**: `Hex`

### totalDifficulty

> **`readonly`** **totalDifficulty**: `Hex`

### transactions

> **`readonly`** **transactions**: `Hex`[]

### transactionsRoot

> **`readonly`** **transactionsRoot**: `Hex`

### uncles

> **`readonly`** **uncles**: `Hex`[]

## Source

[common/BlockResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/common/BlockResult.ts#L7)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
