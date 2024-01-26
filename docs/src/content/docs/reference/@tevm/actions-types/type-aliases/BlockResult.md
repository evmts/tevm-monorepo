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

> **`readonly`** **difficulty**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

### extraData

> **`readonly`** **extraData**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

### gasLimit

> **`readonly`** **gasLimit**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

### gasUsed

> **`readonly`** **gasUsed**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

### hash

> **`readonly`** **hash**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

The hex stringhash of the block.

### logsBloom

> **`readonly`** **logsBloom**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

### miner

> **`readonly`** **miner**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

### nonce

> **`readonly`** **nonce**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

### number

> **`readonly`** **number**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

The block number (height) in the blockchain.

### parentHash

> **`readonly`** **parentHash**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

The hex stringhash of the parent block.

### sha3Uncles

> **`readonly`** **sha3Uncles**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

The hex stringhash of the uncles of the block.

### size

> **`readonly`** **size**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

### stateRoot

> **`readonly`** **stateRoot**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

### timestamp

> **`readonly`** **timestamp**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

### totalDifficulty

> **`readonly`** **totalDifficulty**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

### transactions

> **`readonly`** **transactions**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)[]

### transactionsRoot

> **`readonly`** **transactionsRoot**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

### uncles

> **`readonly`** **uncles**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)[]

## Source

[common/BlockResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/common/BlockResult.ts#L7)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
