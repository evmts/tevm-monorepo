[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / JsonBlock

# Interface: JsonBlock

Defined in: tevm-monorepo/packages/block/types/types.d.ts:405

An object with the block's data represented as strings.

## Properties

### executionWitness?

> `optional` **executionWitness?**: [`VerkleExecutionWitness`](VerkleExecutionWitness.md) \| `null`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:414

***

### header?

> `optional` **header?**: [`JsonHeader`](JsonHeader.md)

Defined in: tevm-monorepo/packages/block/types/types.d.ts:409

Header data for the block

***

### requests?

> `optional` **requests?**: `` `0x${string}` ``[] \| `null`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:413

***

### transactions?

> `optional` **transactions?**: [`JsonTx`](../../tx/interfaces/JsonTx.md)[]

Defined in: tevm-monorepo/packages/block/types/types.d.ts:410

***

### uncleHeaders?

> `optional` **uncleHeaders?**: [`JsonHeader`](JsonHeader.md)[]

Defined in: tevm-monorepo/packages/block/types/types.d.ts:411

***

### withdrawals?

> `optional` **withdrawals?**: [`JsonRpcWithdrawal`](../../utils/interfaces/JsonRpcWithdrawal.md)[]

Defined in: tevm-monorepo/packages/block/types/types.d.ts:412
