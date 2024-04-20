**@tevm/block** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/block](../README.md) / BlockData

# Interface: BlockData

A block's data.

## Properties

### executionWitness?

> **`optional`** **executionWitness**: `null` \| `VerkleExecutionWitness`

EIP-6800: Verkle Proof Data (experimental)

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/types.d.ts:139

***

### header?

> **`optional`** **header**: `HeaderData`

Header data for the block

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/types.d.ts:132

***

### transactions?

> **`optional`** **transactions**: (`LegacyTxData` \| `AccessListEIP2930TxData` \| `FeeMarketEIP1559TxData` \| `BlobEIP4844TxData`)[]

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/types.d.ts:133

***

### uncleHeaders?

> **`optional`** **uncleHeaders**: `HeaderData`[]

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/types.d.ts:134

***

### withdrawals?

> **`optional`** **withdrawals**: `WithdrawalData`[]

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/types.d.ts:135
