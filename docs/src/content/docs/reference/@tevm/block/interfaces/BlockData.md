---
editUrl: false
next: false
prev: false
title: "BlockData"
---

A block's data.

## Properties

### executionWitness?

> `optional` **executionWitness**: `null` \| [`VerkleExecutionWitness`](/reference/tevm/block/interfaces/verkleexecutionwitness/)

EIP-6800: Verkle Proof Data (experimental)

#### Source

[types.ts:151](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L151)

***

### header?

> `optional` **header**: [`HeaderData`](/reference/tevm/block/interfaces/headerdata/)

Header data for the block

#### Source

[types.ts:143](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L143)

***

### requests?

> `optional` **requests**: [`ClRequest`](/reference/tevm/block/classes/clrequest/)[]

#### Source

[types.ts:147](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L147)

***

### transactions?

> `optional` **transactions**: (`LegacyTxData` \| `AccessListEIP2930TxData` \| `FeeMarketEIP1559TxData` \| `BlobEIP4844TxData`)[]

#### Source

[types.ts:144](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L144)

***

### uncleHeaders?

> `optional` **uncleHeaders**: [`HeaderData`](/reference/tevm/block/interfaces/headerdata/)[]

#### Source

[types.ts:145](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L145)

***

### withdrawals?

> `optional` **withdrawals**: [`WithdrawalData`](/reference/tevm/utils/type-aliases/withdrawaldata/)[]

#### Source

[types.ts:146](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L146)
