[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / BlockData

# Interface: BlockData

Defined in: packages/block/types/types.d.ts:131

A block's data.

## Properties

### executionWitness?

> `optional` **executionWitness**: `null` \| [`VerkleExecutionWitness`](VerkleExecutionWitness.md)

Defined in: packages/block/types/types.d.ts:143

EIP-6800: Verkle Proof Data (experimental)

***

### header?

> `optional` **header**: [`HeaderData`](HeaderData.md)

Defined in: packages/block/types/types.d.ts:135

Header data for the block

***

### requests?

> `optional` **requests**: [`ClRequest`](../classes/ClRequest.md)[]

Defined in: packages/block/types/types.d.ts:139

***

### transactions?

> `optional` **transactions**: (`LegacyTxData` \| `AccessListEIP2930TxData` \| `FeeMarketEIP1559TxData` \| `BlobEIP4844TxData` \| `EOACodeEIP7702TxData`)[]

Defined in: packages/block/types/types.d.ts:136

***

### uncleHeaders?

> `optional` **uncleHeaders**: [`HeaderData`](HeaderData.md)[]

Defined in: packages/block/types/types.d.ts:137

***

### withdrawals?

> `optional` **withdrawals**: [`WithdrawalData`](../../utils/type-aliases/WithdrawalData.md)[]

Defined in: packages/block/types/types.d.ts:138
