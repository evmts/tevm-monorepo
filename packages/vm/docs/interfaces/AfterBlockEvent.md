[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / AfterBlockEvent

# Interface: AfterBlockEvent

Defined in: [packages/vm/src/utils/AfterblockEvent.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/AfterblockEvent.ts#L20)

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

> **block**: `Block`

Defined in: [packages/vm/src/utils/AfterblockEvent.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/AfterblockEvent.ts#L22)

***

### gasUsed

> **gasUsed**: `bigint`

Defined in: [packages/vm/src/utils/ApplyBlockResult.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L17)

The gas used after executing the block

#### Inherited from

[`ApplyBlockResult`](ApplyBlockResult.md).[`gasUsed`](ApplyBlockResult.md#gasused)

***

### logsBloom

> **logsBloom**: `Uint8Array`

Defined in: [packages/vm/src/utils/RunBlockResult.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockResult.ts#L15)

The bloom filter of the LOGs (events) after executing the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`logsBloom`](RunBlockResult.md#logsbloom)

***

### preimages?

> `optional` **preimages**: `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [packages/vm/src/utils/ApplyBlockResult.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L33)

Preimages mapping of the touched accounts from the block (see reportPreimages option)

#### Inherited from

[`ApplyBlockResult`](ApplyBlockResult.md).[`preimages`](ApplyBlockResult.md#preimages)

***

### receipts

> **receipts**: [`TxReceipt`](../type-aliases/TxReceipt.md)[]

Defined in: [packages/vm/src/utils/ApplyBlockResult.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L25)

Receipts generated for transactions in the block

#### Inherited from

[`ApplyBlockResult`](ApplyBlockResult.md).[`receipts`](ApplyBlockResult.md#receipts)

***

### receiptsRoot

> **receiptsRoot**: `Uint8Array`

Defined in: [packages/vm/src/utils/ApplyBlockResult.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L21)

The receipt root after executing the block

#### Inherited from

[`ApplyBlockResult`](ApplyBlockResult.md).[`receiptsRoot`](ApplyBlockResult.md#receiptsroot)

***

### requests?

> `optional` **requests**: `ClRequest`[]

Defined in: [packages/vm/src/utils/RunBlockResult.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockResult.ts#L24)

Any CL requests that were processed in the course of this block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`requests`](RunBlockResult.md#requests)

***

### requestsRoot?

> `optional` **requestsRoot**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/vm/src/utils/RunBlockResult.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockResult.ts#L20)

The requestsRoot for any CL requests in the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`requestsRoot`](RunBlockResult.md#requestsroot)

***

### results

> **results**: [`RunTxResult`](RunTxResult.md)[]

Defined in: [packages/vm/src/utils/ApplyBlockResult.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L29)

Results of executing the transactions in the block

#### Inherited from

[`ApplyBlockResult`](ApplyBlockResult.md).[`results`](ApplyBlockResult.md#results)

***

### stateRoot

> **stateRoot**: `Uint8Array`

Defined in: [packages/vm/src/utils/RunBlockResult.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockResult.ts#L11)

The stateRoot after executing the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`stateRoot`](RunBlockResult.md#stateroot)
