[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [vm](../README.md) / ApplyBlockResult

# Interface: ApplyBlockResult

Result of [applyBlock](../functions/applyBlock.md)

## Properties

### bloom

> **bloom**: `Bloom`

The Bloom filter

#### Defined in

packages/vm/types/utils/ApplyBlockResult.d.ts:12

***

### gasUsed

> **gasUsed**: `bigint`

The gas used after executing the block

#### Defined in

packages/vm/types/utils/ApplyBlockResult.d.ts:16

***

### preimages?

> `optional` **preimages**: `Map`\<\`0x$\{string\}\`, `Uint8Array`\>

Preimages mapping of the touched accounts from the block (see reportPreimages option)

#### Defined in

packages/vm/types/utils/ApplyBlockResult.d.ts:32

***

### receipts

> **receipts**: [`TxReceipt`](../type-aliases/TxReceipt.md)[]

Receipts generated for transactions in the block

#### Defined in

packages/vm/types/utils/ApplyBlockResult.d.ts:24

***

### receiptsRoot

> **receiptsRoot**: `Uint8Array`

The receipt root after executing the block

#### Defined in

packages/vm/types/utils/ApplyBlockResult.d.ts:20

***

### results

> **results**: [`RunTxResult`](RunTxResult.md)[]

Results of executing the transactions in the block

#### Defined in

packages/vm/types/utils/ApplyBlockResult.d.ts:28
