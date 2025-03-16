[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / JsonBlock

# Interface: JsonBlock

Defined in: [packages/block/src/types.ts:421](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L421)

An object with the block's data represented as strings.

## Properties

### executionWitness?

> `optional` **executionWitness**: `null` \| [`VerkleExecutionWitness`](VerkleExecutionWitness.md)

Defined in: [packages/block/src/types.ts:430](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L430)

***

### header?

> `optional` **header**: [`JsonHeader`](JsonHeader.md)

Defined in: [packages/block/src/types.ts:425](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L425)

Header data for the block

***

### requests?

> `optional` **requests**: `null` \| `` `0x${string}` ``[]

Defined in: [packages/block/src/types.ts:429](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L429)

***

### transactions?

> `optional` **transactions**: `JsonTx`[]

Defined in: [packages/block/src/types.ts:426](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L426)

***

### uncleHeaders?

> `optional` **uncleHeaders**: [`JsonHeader`](JsonHeader.md)[]

Defined in: [packages/block/src/types.ts:427](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L427)

***

### withdrawals?

> `optional` **withdrawals**: `JsonRpcWithdrawal`[]

Defined in: [packages/block/src/types.ts:428](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L428)
