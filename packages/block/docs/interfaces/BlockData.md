**@tevm/block** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > BlockData

# Interface: BlockData

A block's data.

## Properties

### executionWitness

> **executionWitness**?: `null` \| [`VerkleExecutionWitness`](VerkleExecutionWitness.md)

EIP-6800: Verkle Proof Data (experimental)

#### Source

[types.ts:151](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L151)

***

### header

> **header**?: [`HeaderData`](HeaderData.md)

Header data for the block

#### Source

[types.ts:143](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L143)

***

### requests

> **requests**?: [`ClRequest`](../classes/ClRequest.md)[]

#### Source

[types.ts:147](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L147)

***

### transactions

> **transactions**?: (`LegacyTxData` \| `AccessListEIP2930TxData` \| `FeeMarketEIP1559TxData` \| `BlobEIP4844TxData`)[]

#### Source

[types.ts:144](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L144)

***

### uncleHeaders

> **uncleHeaders**?: [`HeaderData`](HeaderData.md)[]

#### Source

[types.ts:145](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L145)

***

### withdrawals

> **withdrawals**?: `WithdrawalData`[]

#### Source

[types.ts:146](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L146)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
