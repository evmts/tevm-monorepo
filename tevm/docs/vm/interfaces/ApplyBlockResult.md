[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / ApplyBlockResult

# Interface: ApplyBlockResult

Defined in: packages/vm/types/utils/ApplyBlockResult.d.ts:8

Result of [applyBlock](../functions/applyBlock.md)

## Properties

### bloom

> **bloom**: `Bloom`

Defined in: packages/vm/types/utils/ApplyBlockResult.d.ts:12

The Bloom filter

***

### gasUsed

> **gasUsed**: `bigint`

Defined in: packages/vm/types/utils/ApplyBlockResult.d.ts:16

The gas used after executing the block

***

### preimages?

> `optional` **preimages**: `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: packages/vm/types/utils/ApplyBlockResult.d.ts:32

Preimages mapping of the touched accounts from the block (see reportPreimages option)

***

### receipts

> **receipts**: [`TxReceipt`](../type-aliases/TxReceipt.md)[]

Defined in: packages/vm/types/utils/ApplyBlockResult.d.ts:24

Receipts generated for transactions in the block

***

### receiptsRoot

> **receiptsRoot**: `Uint8Array`

Defined in: packages/vm/types/utils/ApplyBlockResult.d.ts:20

The receipt root after executing the block

***

### results

> **results**: [`RunTxResult`](RunTxResult.md)[]

Defined in: packages/vm/types/utils/ApplyBlockResult.d.ts:28

Results of executing the transactions in the block
