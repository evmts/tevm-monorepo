[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / BlockResult

# Type Alias: BlockResult\<TIncludeTransactions\>

> **BlockResult**\<`TIncludeTransactions`\> = `object`

Defined in: packages/actions/types/common/BlockResult.d.ts:7

The type returned by block related
json rpc procedures

## Type Parameters

### TIncludeTransactions

`TIncludeTransactions` *extends* `boolean` = `false`

## Properties

### difficulty

> `readonly` **difficulty**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/BlockResult.d.ts:29

***

### extraData

> `readonly` **extraData**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/BlockResult.d.ts:31

***

### gasLimit

> `readonly` **gasLimit**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/BlockResult.d.ts:33

***

### gasUsed

> `readonly` **gasUsed**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/BlockResult.d.ts:34

***

### hash

> `readonly` **hash**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/BlockResult.d.ts:15

The hex stringhash of the block.

***

### logsBloom

> `readonly` **logsBloom**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/BlockResult.d.ts:25

***

### miner

> `readonly` **miner**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/BlockResult.d.ts:28

***

### nonce

> `readonly` **nonce**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/BlockResult.d.ts:20

***

### number

> `readonly` **number**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/BlockResult.d.ts:11

The block number (height) in the blockchain.

***

### parentHash

> `readonly` **parentHash**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/BlockResult.d.ts:19

The hex stringhash of the parent block.

***

### sha3Uncles

> `readonly` **sha3Uncles**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/BlockResult.d.ts:24

The hex stringhash of the uncles of the block.

***

### size

> `readonly` **size**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/BlockResult.d.ts:32

***

### stateRoot

> `readonly` **stateRoot**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/BlockResult.d.ts:27

***

### timestamp

> `readonly` **timestamp**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/BlockResult.d.ts:35

***

### totalDifficulty

> `readonly` **totalDifficulty**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/BlockResult.d.ts:30

***

### transactions

> `readonly` **transactions**: `TIncludeTransactions` *extends* `true` ? [`TransactionParams`](TransactionParams.md)[] : [`Hex`](../../actions/type-aliases/Hex.md)[]

Defined in: packages/actions/types/common/BlockResult.d.ts:36

***

### transactionsRoot

> `readonly` **transactionsRoot**: [`Hex`](../../actions/type-aliases/Hex.md)

Defined in: packages/actions/types/common/BlockResult.d.ts:26

***

### uncles

> `readonly` **uncles**: [`Hex`](../../actions/type-aliases/Hex.md)[]

Defined in: packages/actions/types/common/BlockResult.d.ts:37
