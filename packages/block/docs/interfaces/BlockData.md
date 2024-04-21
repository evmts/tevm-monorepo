**@tevm/block** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > BlockData

# Interface: BlockData

A block's data.

## Properties

### executionWitness

> **executionWitness**?: `null` \| `VerkleExecutionWitness`

EIP-6800: Verkle Proof Data (experimental)

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/types.d.ts:139

***

### header

> **header**?: `HeaderData`

Header data for the block

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/types.d.ts:132

***

### transactions

> **transactions**?: (`LegacyTxData` \| `AccessListEIP2930TxData` \| `FeeMarketEIP1559TxData` \| `BlobEIP4844TxData`)[]

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/types.d.ts:133

***

### uncleHeaders

> **uncleHeaders**?: `HeaderData`[]

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/types.d.ts:134

***

### withdrawals

> **withdrawals**?: `WithdrawalData`[]

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/types.d.ts:135

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
