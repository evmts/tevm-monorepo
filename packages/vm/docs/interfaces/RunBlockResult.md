[**@tevm/vm**](../README.md) • **Docs**

***

[@tevm/vm](../globals.md) / RunBlockResult

# Interface: RunBlockResult

Result of runBlock

## Extends

- `Omit`\<[`ApplyBlockResult`](ApplyBlockResult.md), `"bloom"`\>

## Extended by

- [`AfterBlockEvent`](AfterBlockEvent.md)

## Properties

### gasUsed

> **gasUsed**: `bigint`

The gas used after executing the block

#### Inherited from

`Omit.gasUsed`

#### Defined in

[packages/vm/src/utils/types.ts:299](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L299)

***

### logsBloom

> **logsBloom**: `Uint8Array`

The bloom filter of the LOGs (events) after executing the block

#### Defined in

[packages/vm/src/utils/types.ts:329](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L329)

***

### preimages?

> `optional` **preimages**: `Map`\<\`0x$\{string\}\`, `Uint8Array`\>

Preimages mapping of the touched accounts from the block (see reportPreimages option)

#### Inherited from

`Omit.preimages`

#### Defined in

[packages/vm/src/utils/types.ts:315](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L315)

***

### receipts

> **receipts**: [`TxReceipt`](../type-aliases/TxReceipt.md)[]

Receipts generated for transactions in the block

#### Inherited from

`Omit.receipts`

#### Defined in

[packages/vm/src/utils/types.ts:307](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L307)

***

### receiptsRoot

> **receiptsRoot**: `Uint8Array`

The receipt root after executing the block

#### Inherited from

`Omit.receiptsRoot`

#### Defined in

[packages/vm/src/utils/types.ts:303](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L303)

***

### requests?

> `optional` **requests**: `ClRequest`[]

Any CL requests that were processed in the course of this block

#### Defined in

[packages/vm/src/utils/types.ts:338](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L338)

***

### requestsRoot?

> `optional` **requestsRoot**: `Uint8Array`

The requestsRoot for any CL requests in the block

#### Defined in

[packages/vm/src/utils/types.ts:334](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L334)

***

### results

> **results**: [`RunTxResult`](RunTxResult.md)[]

Results of executing the transactions in the block

#### Inherited from

`Omit.results`

#### Defined in

[packages/vm/src/utils/types.ts:311](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L311)

***

### stateRoot

> **stateRoot**: `Uint8Array`

The stateRoot after executing the block

#### Defined in

[packages/vm/src/utils/types.ts:325](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L325)
