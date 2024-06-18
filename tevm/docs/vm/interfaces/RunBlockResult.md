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

#### Source

packages/vm/types/utils/types.d.ts:276

***

### logsBloom

> **logsBloom**: `Uint8Array`

The bloom filter of the LOGs (events) after executing the block

#### Source

packages/vm/types/utils/types.d.ts:305

***

### preimages?

> `optional` **preimages**: `Map`\<\`0x$\{string\}\`, `Uint8Array`\>

Preimages mapping of the touched accounts from the block (see reportPreimages option)

#### Inherited from

`Omit.preimages`

#### Source

packages/vm/types/utils/types.d.ts:292

***

### receipts

> **receipts**: [`TxReceipt`](../type-aliases/TxReceipt.md)[]

Receipts generated for transactions in the block

#### Inherited from

`Omit.receipts`

#### Source

packages/vm/types/utils/types.d.ts:284

***

### receiptsRoot

> **receiptsRoot**: `Uint8Array`

The receipt root after executing the block

#### Inherited from

`Omit.receiptsRoot`

#### Source

packages/vm/types/utils/types.d.ts:280

***

### requests?

> `optional` **requests**: [`ClRequest`](../../block/classes/ClRequest.md)[]

Any CL requests that were processed in the course of this block

#### Source

packages/vm/types/utils/types.d.ts:313

***

### requestsRoot?

> `optional` **requestsRoot**: `Uint8Array`

The requestsRoot for any CL requests in the block

#### Source

packages/vm/types/utils/types.d.ts:309

***

### results

> **results**: [`RunTxResult`](RunTxResult.md)[]

Results of executing the transactions in the block

#### Inherited from

`Omit.results`

#### Source

packages/vm/types/utils/types.d.ts:288

***

### stateRoot

> **stateRoot**: `Uint8Array`

The stateRoot after executing the block

#### Source

packages/vm/types/utils/types.d.ts:301
