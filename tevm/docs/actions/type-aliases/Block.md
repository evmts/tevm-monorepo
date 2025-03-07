[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / Block

# Type Alias: Block

> **Block**: `object`

Defined in: packages/actions/types/common/Block.d.ts:5

Header information of an ethereum block

## Type declaration

### baseFeePerGas?

> `readonly` `optional` **baseFeePerGas**: `bigint`

(Optional) The base fee per gas in the block, introduced in EIP-1559 for dynamic transaction fee calculation.

### blobGasPrice?

> `readonly` `optional` **blobGasPrice**: `bigint`

The gas price for the block; may be undefined in blocks after EIP-1559.

### coinbase

> `readonly` **coinbase**: [`Address`](Address.md)

The address of the miner or validator who mined or validated the block.

### difficulty

> `readonly` **difficulty**: `bigint`

The difficulty level of the block (relevant in PoW chains).

### gasLimit

> `readonly` **gasLimit**: `bigint`

The gas limit for the block, i.e., the maximum amount of gas that can be used by the transactions in the block.

### number

> `readonly` **number**: `bigint`

The block number (height) in the blockchain.

### timestamp

> `readonly` **timestamp**: `bigint`

The timestamp at which the block was mined or validated.
