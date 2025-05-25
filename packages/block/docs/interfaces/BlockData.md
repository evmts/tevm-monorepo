[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / BlockData

# Interface: BlockData

Defined in: packages/block/src/types.ts:193

A block's data.

## Properties

### executionWitness?

> `optional` **executionWitness**: `null` \| [`VerkleExecutionWitness`](VerkleExecutionWitness.md)

Defined in: packages/block/src/types.ts:205

EIP-6800: Verkle Proof Data (experimental)

***

### header?

> `optional` **header**: [`HeaderData`](HeaderData.md)

Defined in: packages/block/src/types.ts:197

Header data for the block

***

### requests?

> `optional` **requests**: [`ClRequest`](../classes/ClRequest.md)[]

Defined in: packages/block/src/types.ts:201

***

### transactions?

> `optional` **transactions**: (`LegacyTxData` \| `AccessList2930TxData` \| `FeeMarketEIP1559TxData` \| `BlobEIP4844TxData` \| `EOACode7702TxData`)[]

Defined in: packages/block/src/types.ts:198

***

### uncleHeaders?

> `optional` **uncleHeaders**: [`HeaderData`](HeaderData.md)[]

Defined in: packages/block/src/types.ts:199

***

### withdrawals?

> `optional` **withdrawals**: `WithdrawalData`[]

Defined in: packages/block/src/types.ts:200
