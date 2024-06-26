[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [block](../README.md) / BlockData

# Interface: BlockData

A block's data.

## Properties

### executionWitness?

> `optional` **executionWitness**: `null` \| [`VerkleExecutionWitness`](VerkleExecutionWitness.md)

EIP-6800: Verkle Proof Data (experimental)

#### Defined in

packages/block/types/types.d.ts:143

***

### header?

> `optional` **header**: [`HeaderData`](HeaderData.md)

Header data for the block

#### Defined in

packages/block/types/types.d.ts:135

***

### requests?

> `optional` **requests**: [`ClRequest`](../classes/ClRequest.md)[]

#### Defined in

packages/block/types/types.d.ts:139

***

### transactions?

> `optional` **transactions**: (`LegacyTxData` \| `AccessListEIP2930TxData` \| `FeeMarketEIP1559TxData` \| `BlobEIP4844TxData`)[]

#### Defined in

packages/block/types/types.d.ts:136

***

### uncleHeaders?

> `optional` **uncleHeaders**: [`HeaderData`](HeaderData.md)[]

#### Defined in

packages/block/types/types.d.ts:137

***

### withdrawals?

> `optional` **withdrawals**: [`WithdrawalData`](../../utils/type-aliases/WithdrawalData.md)[]

#### Defined in

packages/block/types/types.d.ts:138
