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

#### Source

[packages/vm/src/utils/types.ts:343](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L343)

***

### gasUsed

> **gasUsed**: `bigint`

The gas used after executing the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`gasUsed`](RunBlockResult.md#gasused)

#### Source

[packages/vm/src/utils/types.ts:299](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L299)

***

### logsBloom

> **logsBloom**: `Uint8Array`

The bloom filter of the LOGs (events) after executing the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`logsBloom`](RunBlockResult.md#logsbloom)

#### Source

[packages/vm/src/utils/types.ts:329](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L329)

***

### preimages?

> `optional` **preimages**: `Map`\<\`0x$\{string\}\`, `Uint8Array`\>

Preimages mapping of the touched accounts from the block (see reportPreimages option)

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`preimages`](RunBlockResult.md#preimages)

#### Source

[packages/vm/src/utils/types.ts:315](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L315)

***

### receipts

> **receipts**: [`TxReceipt`](../type-aliases/TxReceipt.md)[]

Receipts generated for transactions in the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`receipts`](RunBlockResult.md#receipts)

#### Source

[packages/vm/src/utils/types.ts:307](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L307)

***

### receiptsRoot

> **receiptsRoot**: `Uint8Array`

The receipt root after executing the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`receiptsRoot`](RunBlockResult.md#receiptsroot)

#### Source

[packages/vm/src/utils/types.ts:303](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L303)

***

### requests?

> `optional` **requests**: `ClRequest`[]

Any CL requests that were processed in the course of this block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`requests`](RunBlockResult.md#requests)

#### Source

[packages/vm/src/utils/types.ts:338](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L338)

***

### requestsRoot?

> `optional` **requestsRoot**: `Uint8Array`

The requestsRoot for any CL requests in the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`requestsRoot`](RunBlockResult.md#requestsroot)

#### Source

[packages/vm/src/utils/types.ts:334](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L334)

***

### results

> **results**: [`RunTxResult`](RunTxResult.md)[]

Results of executing the transactions in the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`results`](RunBlockResult.md#results)

#### Source

[packages/vm/src/utils/types.ts:311](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L311)

***

### stateRoot

> **stateRoot**: `Uint8Array`

The stateRoot after executing the block

#### Inherited from

[`RunBlockResult`](RunBlockResult.md).[`stateRoot`](RunBlockResult.md#stateroot)

#### Source

[packages/vm/src/utils/types.ts:325](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L325)
