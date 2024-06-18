[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [block](../README.md) / JsonBlock

# Interface: JsonBlock

An object with the block's data represented as strings.

## Properties

### executionWitness?

> `optional` **executionWitness**: `null` \| [`VerkleExecutionWitness`](VerkleExecutionWitness.md)

#### Source

packages/block/types/types.d.ts:171

***

### header?

> `optional` **header**: [`JsonHeader`](JsonHeader.md)

Header data for the block

#### Source

packages/block/types/types.d.ts:166

***

### requests?

> `optional` **requests**: `null` \| \`0x$\{string\}\`[]

#### Source

packages/block/types/types.d.ts:170

***

### transactions?

> `optional` **transactions**: [`JsonTx`](../../tx/interfaces/JsonTx.md)[]

#### Source

packages/block/types/types.d.ts:167

***

### uncleHeaders?

> `optional` **uncleHeaders**: [`JsonHeader`](JsonHeader.md)[]

#### Source

packages/block/types/types.d.ts:168

***

### withdrawals?

> `optional` **withdrawals**: [`JsonRpcWithdrawal`](../../utils/interfaces/JsonRpcWithdrawal.md)[]

#### Source

packages/block/types/types.d.ts:169
