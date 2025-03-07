[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / ApplyBlockResult

# Interface: ApplyBlockResult

Defined in: [packages/vm/src/utils/ApplyBlockResult.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L9)

Result of [applyBlock](../functions/applyBlock.md)

## Properties

### bloom

> **bloom**: `Bloom`

Defined in: [packages/vm/src/utils/ApplyBlockResult.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L13)

The Bloom filter

***

### gasUsed

> **gasUsed**: `bigint`

Defined in: [packages/vm/src/utils/ApplyBlockResult.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L17)

The gas used after executing the block

***

### preimages?

> `optional` **preimages**: `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [packages/vm/src/utils/ApplyBlockResult.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L33)

Preimages mapping of the touched accounts from the block (see reportPreimages option)

***

### receipts

> **receipts**: [`TxReceipt`](../type-aliases/TxReceipt.md)[]

Defined in: [packages/vm/src/utils/ApplyBlockResult.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L25)

Receipts generated for transactions in the block

***

### receiptsRoot

> **receiptsRoot**: `Uint8Array`

Defined in: [packages/vm/src/utils/ApplyBlockResult.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L21)

The receipt root after executing the block

***

### results

> **results**: [`RunTxResult`](RunTxResult.md)[]

Defined in: [packages/vm/src/utils/ApplyBlockResult.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L29)

Results of executing the transactions in the block
