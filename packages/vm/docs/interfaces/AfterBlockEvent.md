[**@tevm/vm**](../README.md) • **Docs**

***

[@tevm/vm](../globals.md) / AfterBlockEvent

# Interface: AfterBlockEvent

Result of runBlock

## Extends

- [`RunBlockResult`](RunBlockResult.md)

## Properties

### block

> **block**: `Block`

#### Defined in

[packages/vm/src/utils/AfterblockEvent.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/AfterblockEvent.ts#L6)

***

### gasUsed

> **gasUsed**: `bigint`

The gas used after executing the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`gasUsed`](RunBlockResult.md#gasused)

#### Defined in

[packages/vm/src/utils/ApplyBlockResult.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L17)

***

### logsBloom

> **logsBloom**: `Uint8Array`

The bloom filter of the LOGs (events) after executing the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`logsBloom`](RunBlockResult.md#logsbloom)

#### Defined in

[packages/vm/src/utils/RunBlockResult.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockResult.ts#L15)

***

### preimages?

> `optional` **preimages**: `Map`\<\`0x$\{string\}\`, `Uint8Array`\>

Preimages mapping of the touched accounts from the block (see reportPreimages option)

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`preimages`](RunBlockResult.md#preimages)

#### Defined in

[packages/vm/src/utils/ApplyBlockResult.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L33)

***

### receipts

> **receipts**: [`TxReceipt`](../type-aliases/TxReceipt.md)[]

Receipts generated for transactions in the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`receipts`](RunBlockResult.md#receipts)

#### Defined in

[packages/vm/src/utils/ApplyBlockResult.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L25)

***

### receiptsRoot

> **receiptsRoot**: `Uint8Array`

The receipt root after executing the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`receiptsRoot`](RunBlockResult.md#receiptsroot)

#### Defined in

[packages/vm/src/utils/ApplyBlockResult.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L21)

***

### requests?

> `optional` **requests**: `ClRequest`[]

Any CL requests that were processed in the course of this block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`requests`](RunBlockResult.md#requests)

#### Defined in

[packages/vm/src/utils/RunBlockResult.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockResult.ts#L24)

***

### requestsRoot?

> `optional` **requestsRoot**: `Uint8Array`

The requestsRoot for any CL requests in the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`requestsRoot`](RunBlockResult.md#requestsroot)

#### Defined in

[packages/vm/src/utils/RunBlockResult.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockResult.ts#L20)

***

### results

> **results**: [`RunTxResult`](RunTxResult.md)[]

Results of executing the transactions in the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`results`](RunBlockResult.md#results)

#### Defined in

[packages/vm/src/utils/ApplyBlockResult.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L29)

***

### stateRoot

> **stateRoot**: `Uint8Array`

The stateRoot after executing the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`stateRoot`](RunBlockResult.md#stateroot)

#### Defined in

[packages/vm/src/utils/RunBlockResult.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockResult.ts#L11)
