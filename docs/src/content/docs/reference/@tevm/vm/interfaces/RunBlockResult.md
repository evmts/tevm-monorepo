---
editUrl: false
next: false
prev: false
title: "RunBlockResult"
---

Result of runBlock

## Extends

- `Omit`\<[`ApplyBlockResult`](/reference/tevm/vm/interfaces/applyblockresult/), `"bloom"`\>

## Extended by

- [`AfterBlockEvent`](/reference/tevm/vm/interfaces/afterblockevent/)

## Properties

### gasUsed

> **gasUsed**: `bigint`

The gas used after executing the block

#### Inherited from

`Omit.gasUsed`

#### Defined in

[packages/vm/src/utils/ApplyBlockResult.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L17)

***

### logsBloom

> **logsBloom**: `Uint8Array`

The bloom filter of the LOGs (events) after executing the block

#### Defined in

[packages/vm/src/utils/RunBlockResult.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockResult.ts#L15)

***

### preimages?

> `optional` **preimages**: `Map`\<\`0x$\{string\}\`, `Uint8Array`\>

Preimages mapping of the touched accounts from the block (see reportPreimages option)

#### Inherited from

`Omit.preimages`

#### Defined in

[packages/vm/src/utils/ApplyBlockResult.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L33)

***

### receipts

> **receipts**: [`TxReceipt`](/reference/tevm/vm/type-aliases/txreceipt/)[]

Receipts generated for transactions in the block

#### Inherited from

`Omit.receipts`

#### Defined in

[packages/vm/src/utils/ApplyBlockResult.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L25)

***

### receiptsRoot

> **receiptsRoot**: `Uint8Array`

The receipt root after executing the block

#### Inherited from

`Omit.receiptsRoot`

#### Defined in

[packages/vm/src/utils/ApplyBlockResult.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L21)

***

### requests?

> `optional` **requests**: [`ClRequest`](/reference/tevm/block/classes/clrequest/)[]

Any CL requests that were processed in the course of this block

#### Defined in

[packages/vm/src/utils/RunBlockResult.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockResult.ts#L24)

***

### requestsRoot?

> `optional` **requestsRoot**: `Uint8Array`

The requestsRoot for any CL requests in the block

#### Defined in

[packages/vm/src/utils/RunBlockResult.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockResult.ts#L20)

***

### results

> **results**: [`RunTxResult`](/reference/tevm/vm/interfaces/runtxresult/)[]

Results of executing the transactions in the block

#### Inherited from

`Omit.results`

#### Defined in

[packages/vm/src/utils/ApplyBlockResult.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L29)

***

### stateRoot

> **stateRoot**: `Uint8Array`

The stateRoot after executing the block

#### Defined in

[packages/vm/src/utils/RunBlockResult.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockResult.ts#L11)
