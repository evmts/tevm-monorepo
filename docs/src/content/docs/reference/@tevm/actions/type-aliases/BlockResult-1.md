---
editUrl: false
next: false
prev: false
title: "BlockResult"
---

> **BlockResult**\<`TIncludeTransactions`\>: `object`

The type returned by block related
json rpc procedures

## Type parameters

• **TIncludeTransactions** *extends* `boolean` = `false`

## Type declaration

### difficulty

> `readonly` **difficulty**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)

### extraData

> `readonly` **extraData**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)

### gasLimit

> `readonly` **gasLimit**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)

### gasUsed

> `readonly` **gasUsed**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)

### hash

> `readonly` **hash**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)

The hex stringhash of the block.

### logsBloom

> `readonly` **logsBloom**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)

### miner

> `readonly` **miner**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)

### nonce

> `readonly` **nonce**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)

### number

> `readonly` **number**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)

The block number (height) in the blockchain.

### parentHash

> `readonly` **parentHash**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)

The hex stringhash of the parent block.

### sha3Uncles

> `readonly` **sha3Uncles**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)

The hex stringhash of the uncles of the block.

### size

> `readonly` **size**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)

### stateRoot

> `readonly` **stateRoot**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)

### timestamp

> `readonly` **timestamp**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)

### totalDifficulty

> `readonly` **totalDifficulty**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)

### transactions

> `readonly` **transactions**: `TIncludeTransactions` *extends* `true` ? [`TransactionParams`](/reference/tevm/actions/type-aliases/transactionparams-1/)[] : [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)[]

### transactionsRoot

> `readonly` **transactionsRoot**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)

### uncles

> `readonly` **uncles**: [`Hex`](/reference/tevm/actions/type-aliases/hex-1/)[]

## Source

[packages/actions/src/common/BlockResult.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L8)
