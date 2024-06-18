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

#### Source

[packages/vm/src/utils/types.ts:343](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L343)

***

### gasUsed

> **gasUsed**: `bigint`

The gas used after executing the block

#### Inherited from

[`RunBlockResult`](/reference/tevm/vm/interfaces/runblockresult/).[`gasUsed`](/reference/tevm/vm/interfaces/runblockresult/#gasused)

#### Source

[packages/vm/src/utils/types.ts:299](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L299)

***

### logsBloom

> **logsBloom**: `Uint8Array`

The bloom filter of the LOGs (events) after executing the block

#### Inherited from

[`RunBlockResult`](/reference/tevm/vm/interfaces/runblockresult/).[`logsBloom`](/reference/tevm/vm/interfaces/runblockresult/#logsbloom)

#### Source

[packages/vm/src/utils/types.ts:329](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L329)

***

### preimages?

> `optional` **preimages**: `Map`\<\`0x$\{string\}\`, `Uint8Array`\>

Preimages mapping of the touched accounts from the block (see reportPreimages option)

#### Inherited from

[`RunBlockResult`](/reference/tevm/vm/interfaces/runblockresult/).[`preimages`](/reference/tevm/vm/interfaces/runblockresult/#preimages)

#### Source

[packages/vm/src/utils/types.ts:315](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L315)

***

### receipts

> **receipts**: [`TxReceipt`](/reference/tevm/vm/type-aliases/txreceipt/)[]

Receipts generated for transactions in the block

#### Inherited from

[`RunBlockResult`](/reference/tevm/vm/interfaces/runblockresult/).[`receipts`](/reference/tevm/vm/interfaces/runblockresult/#receipts)

#### Source

[packages/vm/src/utils/types.ts:307](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L307)

***

### receiptsRoot

> **receiptsRoot**: `Uint8Array`

The receipt root after executing the block

#### Inherited from

[`RunBlockResult`](/reference/tevm/vm/interfaces/runblockresult/).[`receiptsRoot`](/reference/tevm/vm/interfaces/runblockresult/#receiptsroot)

#### Source

[packages/vm/src/utils/types.ts:303](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L303)

***

### requests?

> `optional` **requests**: [`ClRequest`](/reference/tevm/block/classes/clrequest/)[]

Any CL requests that were processed in the course of this block

#### Inherited from

[`RunBlockResult`](/reference/tevm/vm/interfaces/runblockresult/).[`requests`](/reference/tevm/vm/interfaces/runblockresult/#requests)

#### Source

[packages/vm/src/utils/types.ts:338](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L338)

***

### requestsRoot?

> `optional` **requestsRoot**: `Uint8Array`

The requestsRoot for any CL requests in the block

#### Inherited from

[`RunBlockResult`](/reference/tevm/vm/interfaces/runblockresult/).[`requestsRoot`](/reference/tevm/vm/interfaces/runblockresult/#requestsroot)

#### Source

[packages/vm/src/utils/types.ts:334](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L334)

***

### results

> **results**: [`RunTxResult`](/reference/tevm/vm/interfaces/runtxresult/)[]

Results of executing the transactions in the block

#### Inherited from

[`RunBlockResult`](/reference/tevm/vm/interfaces/runblockresult/).[`results`](/reference/tevm/vm/interfaces/runblockresult/#results)

#### Source

[packages/vm/src/utils/types.ts:311](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L311)

***

### stateRoot

> **stateRoot**: `Uint8Array`

The stateRoot after executing the block

#### Inherited from

[`RunBlockResult`](/reference/tevm/vm/interfaces/runblockresult/).[`stateRoot`](/reference/tevm/vm/interfaces/runblockresult/#stateroot)

#### Source

[packages/vm/src/utils/types.ts:325](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L325)
