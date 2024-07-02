[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [vm](../README.md) / RunBlockResult

# Interface: RunBlockResult

Result of runBlock

## Extends

- `Omit`\<[`ApplyBlockResult`](ApplyBlockResult.md), `"bloom"`\>

## Extended by

- [`AfterBlockEvent`](AfterBlockEvent.md)

## Properties

### gasUsed

> **gasUsed**: `bigint`

The gas used after executing the block

#### Inherited from

`Omit.gasUsed`

#### Defined in

packages/vm/types/utils/ApplyBlockResult.d.ts:16

***

### logsBloom

> **logsBloom**: `Uint8Array`

The bloom filter of the LOGs (events) after executing the block

#### Defined in

packages/vm/types/utils/RunBlockResult.d.ts:14

***

### preimages?

> `optional` **preimages**: `Map`\<\`0x$\{string\}\`, `Uint8Array`\>

Preimages mapping of the touched accounts from the block (see reportPreimages option)

#### Inherited from

`Omit.preimages`

#### Defined in

packages/vm/types/utils/ApplyBlockResult.d.ts:32

***

### receipts

> **receipts**: [`TxReceipt`](../type-aliases/TxReceipt.md)[]

Receipts generated for transactions in the block

#### Inherited from

`Omit.receipts`

#### Defined in

packages/vm/types/utils/ApplyBlockResult.d.ts:24

***

### receiptsRoot

> **receiptsRoot**: `Uint8Array`

The receipt root after executing the block

#### Inherited from

`Omit.receiptsRoot`

#### Defined in

packages/vm/types/utils/ApplyBlockResult.d.ts:20

***

### requests?

> `optional` **requests**: [`ClRequest`](../../block/classes/ClRequest.md)[]

Any CL requests that were processed in the course of this block

#### Defined in

packages/vm/types/utils/RunBlockResult.d.ts:22

***

### requestsRoot?

> `optional` **requestsRoot**: `Uint8Array`

The requestsRoot for any CL requests in the block

#### Defined in

packages/vm/types/utils/RunBlockResult.d.ts:18

***

### results

> **results**: [`RunTxResult`](RunTxResult.md)[]

Results of executing the transactions in the block

#### Inherited from

`Omit.results`

#### Defined in

packages/vm/types/utils/ApplyBlockResult.d.ts:28

***

### stateRoot

> **stateRoot**: `Uint8Array`

The stateRoot after executing the block

#### Defined in

packages/vm/types/utils/RunBlockResult.d.ts:10
