---
editUrl: false
next: false
prev: false
title: "ApplyBlockResult"
---

Result of applyBlock

## Properties

### bloom

> **bloom**: `Bloom`

The Bloom filter

#### Source

[packages/vm/src/utils/types.ts:295](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L295)

***

### gasUsed

> **gasUsed**: `bigint`

The gas used after executing the block

#### Source

[packages/vm/src/utils/types.ts:299](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L299)

***

### preimages?

> `optional` **preimages**: `Map`\<\`0x$\{string\}\`, `Uint8Array`\>

Preimages mapping of the touched accounts from the block (see reportPreimages option)

#### Source

[packages/vm/src/utils/types.ts:315](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L315)

***

### receipts

> **receipts**: [`TxReceipt`](/reference/tevm/vm/type-aliases/txreceipt/)[]

Receipts generated for transactions in the block

#### Source

[packages/vm/src/utils/types.ts:307](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L307)

***

### receiptsRoot

> **receiptsRoot**: `Uint8Array`

The receipt root after executing the block

#### Source

[packages/vm/src/utils/types.ts:303](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L303)

***

### results

> **results**: [`RunTxResult`](/reference/tevm/vm/interfaces/runtxresult/)[]

Results of executing the transactions in the block

#### Source

[packages/vm/src/utils/types.ts:311](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L311)
