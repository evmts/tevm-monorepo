[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / JsonBlock

# Interface: JsonBlock

Defined in: packages/block/src/types.ts:421

An object with the block's data represented as strings.

## Properties

### executionWitness?

> `optional` **executionWitness**: `null` \| [`VerkleExecutionWitness`](VerkleExecutionWitness.md)

Defined in: packages/block/src/types.ts:430

***

### header?

> `optional` **header**: [`JsonHeader`](JsonHeader.md)

Defined in: packages/block/src/types.ts:425

Header data for the block

***

### requests?

> `optional` **requests**: `null` \| `` `0x${string}` ``[]

Defined in: packages/block/src/types.ts:429

***

### transactions?

> `optional` **transactions**: `JSONTx`[]

Defined in: packages/block/src/types.ts:426

***

### uncleHeaders?

> `optional` **uncleHeaders**: [`JsonHeader`](JsonHeader.md)[]

Defined in: packages/block/src/types.ts:427

***

### withdrawals?

> `optional` **withdrawals**: `JSONRPCWithdrawal`[]

Defined in: packages/block/src/types.ts:428
