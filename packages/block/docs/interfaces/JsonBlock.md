**@tevm/block** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > JsonBlock

# Interface: JsonBlock

An object with the block's data represented as strings.

## Properties

### executionWitness

> **executionWitness**?: `null` \| [`VerkleExecutionWitness`](VerkleExecutionWitness.md)

#### Source

[types.ts:187](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L187)

***

### header

> **header**?: [`JsonHeader`](JsonHeader.md)

Header data for the block

#### Source

[types.ts:182](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L182)

***

### requests

> **requests**?: `null` \| \`0x${string}\`[]

#### Source

[types.ts:186](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L186)

***

### transactions

> **transactions**?: `JsonTx`[]

#### Source

[types.ts:183](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L183)

***

### uncleHeaders

> **uncleHeaders**?: [`JsonHeader`](JsonHeader.md)[]

#### Source

[types.ts:184](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L184)

***

### withdrawals

> **withdrawals**?: `JsonRpcWithdrawal`[]

#### Source

[types.ts:185](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L185)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
