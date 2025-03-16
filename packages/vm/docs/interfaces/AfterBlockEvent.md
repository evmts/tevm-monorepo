[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / AfterBlockEvent

# Interface: AfterBlockEvent

Defined in: [packages/vm/src/utils/AfterblockEvent.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/AfterblockEvent.ts#L15)

[Description of what this interface represents]

## Example

```typescript
import { AfterBlockEvent } from '[package-path]'

const value: AfterBlockEvent = {
  // Initialize properties
}
```

## Extends

- [`RunBlockResult`](RunBlockResult.md)

## Properties

### block

> **block**: `Block`

Defined in: [packages/vm/src/utils/AfterblockEvent.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/AfterblockEvent.ts#L17)

***

### gasUsed

> **gasUsed**: `bigint`

Defined in: [packages/vm/src/utils/ApplyBlockResult.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L17)

The gas used after executing the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`gasUsed`](RunBlockResult.md#gasused)

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

[`RunBlockResult`](RunBlockResult.md).[`preimages`](RunBlockResult.md#preimages)

***

### receipts

> **receipts**: [`TxReceipt`](../type-aliases/TxReceipt.md)[]

Defined in: [packages/vm/src/utils/ApplyBlockResult.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L25)

Receipts generated for transactions in the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`receipts`](RunBlockResult.md#receipts)

***

### receiptsRoot

> **receiptsRoot**: `Uint8Array`

Defined in: [packages/vm/src/utils/ApplyBlockResult.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L21)

The receipt root after executing the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`receiptsRoot`](RunBlockResult.md#receiptsroot)

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

[`RunBlockResult`](RunBlockResult.md).[`results`](RunBlockResult.md#results)

***

### stateRoot

> **stateRoot**: `Uint8Array`

Defined in: [packages/vm/src/utils/RunBlockResult.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockResult.ts#L11)

The stateRoot after executing the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`stateRoot`](RunBlockResult.md#stateroot)
