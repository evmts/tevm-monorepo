---
editUrl: false
next: false
prev: false
title: "AfterBlockEvent"
---

Result of runBlock

## Extends

- [`RunBlockResult`](/reference/tevm/vm/interfaces/runblockresult/)

## Properties

### block

> **block**: [`Block`](/reference/tevm/block/classes/block/)

#### Defined in

[packages/vm/src/utils/AfterblockEvent.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/AfterblockEvent.ts#L6)

***

### gasUsed

> **gasUsed**: `bigint`

The gas used after executing the block

#### Inherited from

[`RunBlockResult`](/reference/tevm/vm/interfaces/runblockresult/).[`gasUsed`](/reference/tevm/vm/interfaces/runblockresult/#gasused)

#### Defined in

[packages/vm/src/utils/ApplyBlockResult.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L17)

***

### logsBloom

> **logsBloom**: `Uint8Array`

The bloom filter of the LOGs (events) after executing the block

#### Inherited from

[`RunBlockResult`](/reference/tevm/vm/interfaces/runblockresult/).[`logsBloom`](/reference/tevm/vm/interfaces/runblockresult/#logsbloom)

#### Defined in

[packages/vm/src/utils/RunBlockResult.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockResult.ts#L15)

***

### preimages?

> `optional` **preimages**: `Map`\<\`0x$\{string\}\`, `Uint8Array`\>

Preimages mapping of the touched accounts from the block (see reportPreimages option)

#### Inherited from

[`RunBlockResult`](/reference/tevm/vm/interfaces/runblockresult/).[`preimages`](/reference/tevm/vm/interfaces/runblockresult/#preimages)

#### Defined in

[packages/vm/src/utils/ApplyBlockResult.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L33)

***

### receipts

> **receipts**: [`TxReceipt`](/reference/tevm/vm/type-aliases/txreceipt/)[]

Receipts generated for transactions in the block

#### Inherited from

[`RunBlockResult`](/reference/tevm/vm/interfaces/runblockresult/).[`receipts`](/reference/tevm/vm/interfaces/runblockresult/#receipts)

#### Defined in

[packages/vm/src/utils/ApplyBlockResult.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L25)

***

### receiptsRoot

> **receiptsRoot**: `Uint8Array`

The receipt root after executing the block

#### Inherited from

[`RunBlockResult`](/reference/tevm/vm/interfaces/runblockresult/).[`receiptsRoot`](/reference/tevm/vm/interfaces/runblockresult/#receiptsroot)

#### Defined in

[packages/vm/src/utils/ApplyBlockResult.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L21)

***

### requests?

> `optional` **requests**: [`ClRequest`](/reference/tevm/block/classes/clrequest/)[]

Any CL requests that were processed in the course of this block

#### Inherited from

[`RunBlockResult`](/reference/tevm/vm/interfaces/runblockresult/).[`requests`](/reference/tevm/vm/interfaces/runblockresult/#requests)

#### Defined in

[packages/vm/src/utils/RunBlockResult.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockResult.ts#L24)

***

### requestsRoot?

> `optional` **requestsRoot**: `Uint8Array`

The requestsRoot for any CL requests in the block

#### Inherited from

[`RunBlockResult`](/reference/tevm/vm/interfaces/runblockresult/).[`requestsRoot`](/reference/tevm/vm/interfaces/runblockresult/#requestsroot)

#### Defined in

[packages/vm/src/utils/RunBlockResult.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockResult.ts#L20)

***

### results

> **results**: [`RunTxResult`](/reference/tevm/vm/interfaces/runtxresult/)[]

Results of executing the transactions in the block

#### Inherited from

[`RunBlockResult`](/reference/tevm/vm/interfaces/runblockresult/).[`results`](/reference/tevm/vm/interfaces/runblockresult/#results)

#### Defined in

[packages/vm/src/utils/ApplyBlockResult.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L29)

***

### stateRoot

> **stateRoot**: `Uint8Array`

The stateRoot after executing the block

#### Inherited from

[`RunBlockResult`](/reference/tevm/vm/interfaces/runblockresult/).[`stateRoot`](/reference/tevm/vm/interfaces/runblockresult/#stateroot)

#### Defined in

[packages/vm/src/utils/RunBlockResult.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockResult.ts#L11)
