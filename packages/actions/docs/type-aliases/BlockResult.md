[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / BlockResult

# Type Alias: BlockResult\<TIncludeTransactions\>

> **BlockResult**\<`TIncludeTransactions`\> = `object`

Defined in: [packages/actions/src/common/BlockResult.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L8)

The type returned by block related
json rpc procedures

## Type Parameters

### TIncludeTransactions

`TIncludeTransactions` *extends* `boolean` = `false`

## Properties

### difficulty

> `readonly` **difficulty**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/BlockResult.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L30)

***

### extraData

> `readonly` **extraData**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/BlockResult.ts:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L32)

***

### gasLimit

> `readonly` **gasLimit**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/BlockResult.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L34)

***

### gasUsed

> `readonly` **gasUsed**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/BlockResult.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L35)

***

### hash

> `readonly` **hash**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/BlockResult.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L16)

The hex stringhash of the block.

***

### logsBloom

> `readonly` **logsBloom**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/BlockResult.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L26)

***

### miner

> `readonly` **miner**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/BlockResult.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L29)

***

### nonce

> `readonly` **nonce**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/BlockResult.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L21)

***

### number

> `readonly` **number**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/BlockResult.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L12)

The block number (height) in the blockchain.

***

### parentHash

> `readonly` **parentHash**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/BlockResult.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L20)

The hex stringhash of the parent block.

***

### sha3Uncles

> `readonly` **sha3Uncles**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/BlockResult.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L25)

The hex stringhash of the uncles of the block.

***

### size

> `readonly` **size**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/BlockResult.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L33)

***

### stateRoot

> `readonly` **stateRoot**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/BlockResult.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L28)

***

### timestamp

> `readonly` **timestamp**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/BlockResult.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L36)

***

### totalDifficulty

> `readonly` **totalDifficulty**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/BlockResult.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L31)

***

### transactions

> `readonly` **transactions**: `TIncludeTransactions` *extends* `true` ? [`TransactionParams`](TransactionParams.md)[] : [`Hex`](Hex.md)[]

Defined in: [packages/actions/src/common/BlockResult.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L37)

***

### transactionsRoot

> `readonly` **transactionsRoot**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/common/BlockResult.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L27)

***

### uncles

> `readonly` **uncles**: [`Hex`](Hex.md)[]

Defined in: [packages/actions/src/common/BlockResult.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L38)
