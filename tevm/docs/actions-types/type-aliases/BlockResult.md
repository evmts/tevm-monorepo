**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [actions-types](../README.md) > BlockResult

# Type alias: BlockResult

> **BlockResult**: `object`

The type returned by block related
json rpc procedures

## Type declaration

### difficulty

> **`readonly`** **difficulty**: [`Hex`](Hex.md)

### extraData

> **`readonly`** **extraData**: [`Hex`](Hex.md)

### gasLimit

> **`readonly`** **gasLimit**: [`Hex`](Hex.md)

### gasUsed

> **`readonly`** **gasUsed**: [`Hex`](Hex.md)

### hash

> **`readonly`** **hash**: [`Hex`](Hex.md)

The hex stringhash of the block.

### logsBloom

> **`readonly`** **logsBloom**: [`Hex`](Hex.md)

### miner

> **`readonly`** **miner**: [`Hex`](Hex.md)

### nonce

> **`readonly`** **nonce**: [`Hex`](Hex.md)

### number

> **`readonly`** **number**: [`Hex`](Hex.md)

The block number (height) in the blockchain.

### parentHash

> **`readonly`** **parentHash**: [`Hex`](Hex.md)

The hex stringhash of the parent block.

### sha3Uncles

> **`readonly`** **sha3Uncles**: [`Hex`](Hex.md)

The hex stringhash of the uncles of the block.

### size

> **`readonly`** **size**: [`Hex`](Hex.md)

### stateRoot

> **`readonly`** **stateRoot**: [`Hex`](Hex.md)

### timestamp

> **`readonly`** **timestamp**: [`Hex`](Hex.md)

### totalDifficulty

> **`readonly`** **totalDifficulty**: [`Hex`](Hex.md)

### transactions

> **`readonly`** **transactions**: [`Hex`](Hex.md)[]

### transactionsRoot

> **`readonly`** **transactionsRoot**: [`Hex`](Hex.md)

### uncles

> **`readonly`** **uncles**: [`Hex`](Hex.md)[]

## Source

packages/actions-types/types/common/BlockResult.d.ts:6

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
