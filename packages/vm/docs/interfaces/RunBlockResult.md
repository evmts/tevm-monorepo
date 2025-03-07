[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / RunBlockResult

# Interface: RunBlockResult

Defined in: [packages/vm/src/utils/RunBlockResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockResult.ts#L7)

Result of runBlock

## Extends

- `Omit`\<[`ApplyBlockResult`](ApplyBlockResult.md), `"bloom"`\>

## Extended by

- [`AfterBlockEvent`](AfterBlockEvent.md)

## Properties

### gasUsed

> **gasUsed**: `bigint`

Defined in: [packages/vm/src/utils/ApplyBlockResult.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L17)

The gas used after executing the block

#### Inherited from

`Omit.gasUsed`

***

### logsBloom

> **logsBloom**: `Uint8Array`

Defined in: [packages/vm/src/utils/RunBlockResult.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockResult.ts#L15)

The bloom filter of the LOGs (events) after executing the block

***

### preimages?

> `optional` **preimages**: `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [packages/vm/src/utils/ApplyBlockResult.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L33)

Preimages mapping of the touched accounts from the block (see reportPreimages option)

#### Inherited from

`Omit.preimages`

***

### receipts

> **receipts**: [`TxReceipt`](../type-aliases/TxReceipt.md)[]

Defined in: [packages/vm/src/utils/ApplyBlockResult.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L25)

Receipts generated for transactions in the block

#### Inherited from

`Omit.receipts`

***

### receiptsRoot

> **receiptsRoot**: `Uint8Array`

Defined in: [packages/vm/src/utils/ApplyBlockResult.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L21)

The receipt root after executing the block

#### Inherited from

`Omit.receiptsRoot`

***

### requests?

> `optional` **requests**: `ClRequest`[]

Defined in: [packages/vm/src/utils/RunBlockResult.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockResult.ts#L24)

Any CL requests that were processed in the course of this block

***

### requestsRoot?

> `optional` **requestsRoot**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/vm/src/utils/RunBlockResult.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockResult.ts#L20)

The requestsRoot for any CL requests in the block

***

### results

> **results**: [`RunTxResult`](RunTxResult.md)[]

Defined in: [packages/vm/src/utils/ApplyBlockResult.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L29)

Results of executing the transactions in the block

#### Inherited from

`Omit.results`

***

### stateRoot

> **stateRoot**: `Uint8Array`

Defined in: [packages/vm/src/utils/RunBlockResult.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockResult.ts#L11)

The stateRoot after executing the block
