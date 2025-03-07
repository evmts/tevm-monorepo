[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / RunBlockResult

# Interface: RunBlockResult

Defined in: packages/vm/types/utils/RunBlockResult.d.ts:6

Result of runBlock

## Extends

- `Omit`\<[`ApplyBlockResult`](ApplyBlockResult.md), `"bloom"`\>

## Extended by

- [`AfterBlockEvent`](AfterBlockEvent.md)

## Properties

### gasUsed

> **gasUsed**: `bigint`

Defined in: packages/vm/types/utils/ApplyBlockResult.d.ts:16

The gas used after executing the block

#### Inherited from

`Omit.gasUsed`

***

### logsBloom

> **logsBloom**: `Uint8Array`

Defined in: packages/vm/types/utils/RunBlockResult.d.ts:14

The bloom filter of the LOGs (events) after executing the block

***

### preimages?

> `optional` **preimages**: `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: packages/vm/types/utils/ApplyBlockResult.d.ts:32

Preimages mapping of the touched accounts from the block (see reportPreimages option)

#### Inherited from

`Omit.preimages`

***

### receipts

> **receipts**: [`TxReceipt`](../type-aliases/TxReceipt.md)[]

Defined in: packages/vm/types/utils/ApplyBlockResult.d.ts:24

Receipts generated for transactions in the block

#### Inherited from

`Omit.receipts`

***

### receiptsRoot

> **receiptsRoot**: `Uint8Array`

Defined in: packages/vm/types/utils/ApplyBlockResult.d.ts:20

The receipt root after executing the block

#### Inherited from

`Omit.receiptsRoot`

***

### requests?

> `optional` **requests**: [`ClRequest`](../../block/classes/ClRequest.md)[]

Defined in: packages/vm/types/utils/RunBlockResult.d.ts:22

Any CL requests that were processed in the course of this block

***

### requestsRoot?

> `optional` **requestsRoot**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: packages/vm/types/utils/RunBlockResult.d.ts:18

The requestsRoot for any CL requests in the block

***

### results

> **results**: [`RunTxResult`](RunTxResult.md)[]

Defined in: packages/vm/types/utils/ApplyBlockResult.d.ts:28

Results of executing the transactions in the block

#### Inherited from

`Omit.results`

***

### stateRoot

> **stateRoot**: `Uint8Array`

Defined in: packages/vm/types/utils/RunBlockResult.d.ts:10

The stateRoot after executing the block
