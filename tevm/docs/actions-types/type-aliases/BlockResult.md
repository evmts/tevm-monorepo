**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [actions-types](../README.md) > BlockResult

# Type alias: BlockResult

> **BlockResult**: `object`

The type returned by block related
json rpc procedures

## Type declaration

### difficulty

> **`readonly`** **difficulty**: [`Hex`](../../index/type-aliases/Hex.md)

### extraData

> **`readonly`** **extraData**: [`Hex`](../../index/type-aliases/Hex.md)

### gasLimit

> **`readonly`** **gasLimit**: [`Hex`](../../index/type-aliases/Hex.md)

### gasUsed

> **`readonly`** **gasUsed**: [`Hex`](../../index/type-aliases/Hex.md)

### hash

> **`readonly`** **hash**: [`Hex`](../../index/type-aliases/Hex.md)

The hex stringhash of the block.

### logsBloom

> **`readonly`** **logsBloom**: [`Hex`](../../index/type-aliases/Hex.md)

### miner

> **`readonly`** **miner**: [`Hex`](../../index/type-aliases/Hex.md)

### nonce

> **`readonly`** **nonce**: [`Hex`](../../index/type-aliases/Hex.md)

### number

> **`readonly`** **number**: [`Hex`](../../index/type-aliases/Hex.md)

The block number (height) in the blockchain.

### parentHash

> **`readonly`** **parentHash**: [`Hex`](../../index/type-aliases/Hex.md)

The hex stringhash of the parent block.

### sha3Uncles

> **`readonly`** **sha3Uncles**: [`Hex`](../../index/type-aliases/Hex.md)

The hex stringhash of the uncles of the block.

### size

> **`readonly`** **size**: [`Hex`](../../index/type-aliases/Hex.md)

### stateRoot

> **`readonly`** **stateRoot**: [`Hex`](../../index/type-aliases/Hex.md)

### timestamp

> **`readonly`** **timestamp**: [`Hex`](../../index/type-aliases/Hex.md)

### totalDifficulty

> **`readonly`** **totalDifficulty**: [`Hex`](../../index/type-aliases/Hex.md)

### transactions

> **`readonly`** **transactions**: [`Hex`](../../index/type-aliases/Hex.md)[]

### transactionsRoot

> **`readonly`** **transactionsRoot**: [`Hex`](../../index/type-aliases/Hex.md)

### uncles

> **`readonly`** **uncles**: [`Hex`](../../index/type-aliases/Hex.md)[]

## Source

packages/actions-types/types/common/BlockResult.d.ts:6

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
