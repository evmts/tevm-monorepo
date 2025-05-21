[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / Block

# Type Alias: Block

> **Block** = `object`

Defined in: [packages/actions/src/common/Block.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/Block.ts#L6)

Header information of an ethereum block

## Properties

### baseFeePerGas?

> `readonly` `optional` **baseFeePerGas**: `bigint`

Defined in: [packages/actions/src/common/Block.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/Block.ts#L35)

(Optional) The base fee per gas in the block, introduced in EIP-1559 for dynamic transaction fee calculation.

***

### blobGasPrice?

> `readonly` `optional` **blobGasPrice**: `bigint`

Defined in: [packages/actions/src/common/Block.ts:40](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/Block.ts#L40)

The gas price for the block; may be undefined in blocks after EIP-1559.

***

### coinbase

> `readonly` **coinbase**: [`Address`](Address.md)

Defined in: [packages/actions/src/common/Block.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/Block.ts#L15)

The address of the miner or validator who mined or validated the block.

***

### difficulty

> `readonly` **difficulty**: `bigint`

Defined in: [packages/actions/src/common/Block.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/Block.ts#L25)

The difficulty level of the block (relevant in PoW chains).

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: [packages/actions/src/common/Block.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/Block.ts#L30)

The gas limit for the block, i.e., the maximum amount of gas that can be used by the transactions in the block.

***

### number

> `readonly` **number**: `bigint`

Defined in: [packages/actions/src/common/Block.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/Block.ts#L10)

The block number (height) in the blockchain.

***

### timestamp

> `readonly` **timestamp**: `bigint`

Defined in: [packages/actions/src/common/Block.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/Block.ts#L20)

The timestamp at which the block was mined or validated.
