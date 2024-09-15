---
editUrl: false
next: false
prev: false
title: "BlockResult"
---

> **BlockResult**\<`TIncludeTransactions`\>: `object`

The type returned by block related
json rpc procedures

## Type Parameters

• **TIncludeTransactions** *extends* `boolean` = `false`

## Type declaration

### difficulty

> `readonly` **difficulty**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

### extraData

> `readonly` **extraData**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

### gasLimit

> `readonly` **gasLimit**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

### gasUsed

> `readonly` **gasUsed**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

### hash

> `readonly` **hash**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

The hex stringhash of the block.

### logsBloom

> `readonly` **logsBloom**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

### miner

> `readonly` **miner**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

### nonce

> `readonly` **nonce**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

### number

> `readonly` **number**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

The block number (height) in the blockchain.

### parentHash

> `readonly` **parentHash**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

The hex stringhash of the parent block.

### sha3Uncles

> `readonly` **sha3Uncles**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

The hex stringhash of the uncles of the block.

### size

> `readonly` **size**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

### stateRoot

> `readonly` **stateRoot**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

### timestamp

> `readonly` **timestamp**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

### totalDifficulty

> `readonly` **totalDifficulty**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

### transactions

> `readonly` **transactions**: `TIncludeTransactions` *extends* `true` ? [`TransactionParams`](/reference/tevm/actions/type-aliases/transactionparams/)[] : [`Hex`](/reference/tevm/actions/type-aliases/hex/)[]

### transactionsRoot

> `readonly` **transactionsRoot**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

### uncles

> `readonly` **uncles**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)[]

## Defined in

[packages/actions/src/common/BlockResult.ts:8](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L8)
