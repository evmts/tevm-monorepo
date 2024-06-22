[**@tevm/vm**](../README.md) • **Docs**

***

[@tevm/vm](../globals.md) / ApplyBlockResult

# Interface: ApplyBlockResult

Result of applyBlock

## Properties

### bloom

> **bloom**: `Bloom`

The Bloom filter

#### Defined in

[packages/vm/src/utils/ApplyBlockResult.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L13)

***

### gasUsed

> **gasUsed**: `bigint`

The gas used after executing the block

#### Defined in

[packages/vm/src/utils/ApplyBlockResult.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L17)

***

### preimages?

> `optional` **preimages**: `Map`\<\`0x$\{string\}\`, `Uint8Array`\>

Preimages mapping of the touched accounts from the block (see reportPreimages option)

#### Defined in

[packages/vm/src/utils/ApplyBlockResult.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L33)

***

### receipts

> **receipts**: [`TxReceipt`](../type-aliases/TxReceipt.md)[]

Receipts generated for transactions in the block

#### Defined in

[packages/vm/src/utils/ApplyBlockResult.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L25)

***

### receiptsRoot

> **receiptsRoot**: `Uint8Array`

The receipt root after executing the block

#### Defined in

[packages/vm/src/utils/ApplyBlockResult.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L21)

***

### results

> **results**: [`RunTxResult`](RunTxResult.md)[]

Results of executing the transactions in the block

#### Defined in

[packages/vm/src/utils/ApplyBlockResult.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L29)
