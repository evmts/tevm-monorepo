[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [vm](../README.md) / AfterBlockEvent

# Interface: AfterBlockEvent

Result of runBlock

## Extends

- [`RunBlockResult`](RunBlockResult.md)

## Properties

### block

> **block**: [`Block`](../../block/classes/Block.md)

#### Source

packages/vm/types/utils/types.d.ts:316

***

### gasUsed

> **gasUsed**: `bigint`

The gas used after executing the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`gasUsed`](RunBlockResult.md#gasused)

#### Source

packages/vm/types/utils/types.d.ts:276

***

### logsBloom

> **logsBloom**: `Uint8Array`

The bloom filter of the LOGs (events) after executing the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`logsBloom`](RunBlockResult.md#logsbloom)

#### Source

packages/vm/types/utils/types.d.ts:305

***

### preimages?

> `optional` **preimages**: `Map`\<\`0x$\{string\}\`, `Uint8Array`\>

Preimages mapping of the touched accounts from the block (see reportPreimages option)

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`preimages`](RunBlockResult.md#preimages)

#### Source

packages/vm/types/utils/types.d.ts:292

***

### receipts

> **receipts**: [`TxReceipt`](../type-aliases/TxReceipt.md)[]

Receipts generated for transactions in the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`receipts`](RunBlockResult.md#receipts)

#### Source

packages/vm/types/utils/types.d.ts:284

***

### receiptsRoot

> **receiptsRoot**: `Uint8Array`

The receipt root after executing the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`receiptsRoot`](RunBlockResult.md#receiptsroot)

#### Source

packages/vm/types/utils/types.d.ts:280

***

### requests?

> `optional` **requests**: [`ClRequest`](../../block/classes/ClRequest.md)[]

Any CL requests that were processed in the course of this block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`requests`](RunBlockResult.md#requests)

#### Source

packages/vm/types/utils/types.d.ts:313

***

### requestsRoot?

> `optional` **requestsRoot**: `Uint8Array`

The requestsRoot for any CL requests in the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`requestsRoot`](RunBlockResult.md#requestsroot)

#### Source

packages/vm/types/utils/types.d.ts:309

***

### results

> **results**: [`RunTxResult`](RunTxResult.md)[]

Results of executing the transactions in the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`results`](RunBlockResult.md#results)

#### Source

packages/vm/types/utils/types.d.ts:288

***

### stateRoot

> **stateRoot**: `Uint8Array`

The stateRoot after executing the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`stateRoot`](RunBlockResult.md#stateroot)

#### Source

packages/vm/types/utils/types.d.ts:301
