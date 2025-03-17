[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / BlockResult

# Type Alias: BlockResult\<TIncludeTransactions\>

> **BlockResult**\<`TIncludeTransactions`\>: `object`

Defined in: packages/actions/dist/index.d.ts:200

The type returned by block related
json rpc procedures

## Type Parameters

• **TIncludeTransactions** *extends* `boolean` = `false`

## Type declaration

### difficulty

> `readonly` **difficulty**: [`Hex`](../../actions/type-aliases/Hex.md)

### extraData

> `readonly` **extraData**: [`Hex`](../../actions/type-aliases/Hex.md)

### gasLimit

> `readonly` **gasLimit**: [`Hex`](../../actions/type-aliases/Hex.md)

### gasUsed

> `readonly` **gasUsed**: [`Hex`](../../actions/type-aliases/Hex.md)

### hash

> `readonly` **hash**: [`Hex`](../../actions/type-aliases/Hex.md)

The hex stringhash of the block.

### logsBloom

> `readonly` **logsBloom**: [`Hex`](../../actions/type-aliases/Hex.md)

### miner

> `readonly` **miner**: [`Hex`](../../actions/type-aliases/Hex.md)

### nonce

> `readonly` **nonce**: [`Hex`](../../actions/type-aliases/Hex.md)

### number

> `readonly` **number**: [`Hex`](../../actions/type-aliases/Hex.md)

The block number (height) in the blockchain.

### parentHash

> `readonly` **parentHash**: [`Hex`](../../actions/type-aliases/Hex.md)

The hex stringhash of the parent block.

### sha3Uncles

> `readonly` **sha3Uncles**: [`Hex`](../../actions/type-aliases/Hex.md)

The hex stringhash of the uncles of the block.

### size

> `readonly` **size**: [`Hex`](../../actions/type-aliases/Hex.md)

### stateRoot

> `readonly` **stateRoot**: [`Hex`](../../actions/type-aliases/Hex.md)

### timestamp

> `readonly` **timestamp**: [`Hex`](../../actions/type-aliases/Hex.md)

### totalDifficulty

> `readonly` **totalDifficulty**: [`Hex`](../../actions/type-aliases/Hex.md)

### transactions

> `readonly` **transactions**: `TIncludeTransactions` *extends* `true` ? [`TransactionParams`](TransactionParams.md)[] : [`Hex`](../../actions/type-aliases/Hex.md)[]

### transactionsRoot

> `readonly` **transactionsRoot**: [`Hex`](../../actions/type-aliases/Hex.md)

### uncles

> `readonly` **uncles**: [`Hex`](../../actions/type-aliases/Hex.md)[]
