[**@tevm/block**](../README.md) • **Docs**

***

[@tevm/block](../globals.md) / JsonBlock

# Interface: JsonBlock

An object with the block's data represented as strings.

## Properties

### executionWitness?

> `optional` **executionWitness**: `null` \| [`VerkleExecutionWitness`](VerkleExecutionWitness.md)

#### Defined in

[types.ts:187](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L187)

***

### header?

> `optional` **header**: [`JsonHeader`](JsonHeader.md)

Header data for the block

#### Defined in

[types.ts:182](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L182)

***

### requests?

> `optional` **requests**: `null` \| \`0x$\{string\}\`[]

#### Defined in

[types.ts:186](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L186)

***

### transactions?

> `optional` **transactions**: `JsonTx`[]

#### Defined in

[types.ts:183](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L183)

***

### uncleHeaders?

> `optional` **uncleHeaders**: [`JsonHeader`](JsonHeader.md)[]

#### Defined in

[types.ts:184](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L184)

***

### withdrawals?

> `optional` **withdrawals**: `JsonRpcWithdrawal`[]

#### Defined in

[types.ts:185](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L185)
