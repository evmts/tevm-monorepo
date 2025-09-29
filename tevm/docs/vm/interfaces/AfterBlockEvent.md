[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / AfterBlockEvent

# Interface: AfterBlockEvent

Defined in: packages/vm/types/utils/AfterblockEvent.d.ts:19

Event data emitted after a block has been processed.
Extends RunBlockResult with the block that was processed.

## Example

```typescript
import { AfterBlockEvent } from '@tevm/vm'
import { VM } from '@tevm/vm'

// Access in VM event handlers
const vm = new VM()
vm.events.on('afterBlock', (event: AfterBlockEvent) => {
  console.log('Block processed:', event.block.header.number)
  console.log('Receipts:', event.receipts)
})
```

## Extends

- [`RunBlockResult`](RunBlockResult.md)

## Properties

### block

> **block**: [`Block`](../../block/classes/Block.md)

Defined in: packages/vm/types/utils/AfterblockEvent.d.ts:20

***

### gasUsed

> **gasUsed**: `bigint`

Defined in: packages/vm/types/utils/ApplyBlockResult.d.ts:16

The gas used after executing the block

#### Inherited from

[`ApplyBlockResult`](ApplyBlockResult.md).[`gasUsed`](ApplyBlockResult.md#gasused)

***

### logsBloom

> **logsBloom**: `Uint8Array`

Defined in: packages/vm/types/utils/RunBlockResult.d.ts:14

The bloom filter of the LOGs (events) after executing the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`logsBloom`](RunBlockResult.md#logsbloom)

***

### preimages?

> `optional` **preimages**: `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: packages/vm/types/utils/ApplyBlockResult.d.ts:32

Preimages mapping of the touched accounts from the block (see reportPreimages option)

#### Inherited from

[`ApplyBlockResult`](ApplyBlockResult.md).[`preimages`](ApplyBlockResult.md#preimages)

***

### receipts

> **receipts**: [`TxReceipt`](../type-aliases/TxReceipt.md)[]

Defined in: packages/vm/types/utils/ApplyBlockResult.d.ts:24

Receipts generated for transactions in the block

#### Inherited from

[`ApplyBlockResult`](ApplyBlockResult.md).[`receipts`](ApplyBlockResult.md#receipts)

***

### receiptsRoot

> **receiptsRoot**: `Uint8Array`

Defined in: packages/vm/types/utils/ApplyBlockResult.d.ts:20

The receipt root after executing the block

#### Inherited from

[`ApplyBlockResult`](ApplyBlockResult.md).[`receiptsRoot`](ApplyBlockResult.md#receiptsroot)

***

### requests?

> `optional` **requests**: [`ClRequest`](../../block/classes/ClRequest.md)[]

Defined in: packages/vm/types/utils/RunBlockResult.d.ts:22

Any CL requests that were processed in the course of this block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`requests`](RunBlockResult.md#requests)

***

### requestsRoot?

> `optional` **requestsRoot**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: packages/vm/types/utils/RunBlockResult.d.ts:18

The requestsRoot for any CL requests in the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`requestsRoot`](RunBlockResult.md#requestsroot)

***

### results

> **results**: [`RunTxResult`](RunTxResult.md)[]

Defined in: packages/vm/types/utils/ApplyBlockResult.d.ts:28

Results of executing the transactions in the block

#### Inherited from

[`ApplyBlockResult`](ApplyBlockResult.md).[`results`](ApplyBlockResult.md#results)

***

### stateRoot

> **stateRoot**: `Uint8Array`

Defined in: packages/vm/types/utils/RunBlockResult.d.ts:10

The stateRoot after executing the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`stateRoot`](RunBlockResult.md#stateroot)
