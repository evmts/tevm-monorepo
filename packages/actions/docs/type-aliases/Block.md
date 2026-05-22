[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / Block

# Type Alias: Block

> **Block** = `object`

Defined in: [packages/actions/src/common/Block.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/Block.ts#L6)

Header information of an ethereum block

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="basefeepergas"></a> `baseFeePerGas?` | `readonly` | `bigint` | (Optional) The base fee per gas in the block, introduced in EIP-1559 for dynamic transaction fee calculation. | [packages/actions/src/common/Block.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/Block.ts#L35) |
| <a id="blobgasprice"></a> `blobGasPrice?` | `readonly` | `bigint` | The gas price for the block; may be undefined in blocks after EIP-1559. | [packages/actions/src/common/Block.ts:40](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/Block.ts#L40) |
| <a id="coinbase"></a> `coinbase` | `readonly` | [`Address`](Address.md) | The address of the miner or validator who mined or validated the block. | [packages/actions/src/common/Block.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/Block.ts#L15) |
| <a id="difficulty"></a> `difficulty` | `readonly` | `bigint` | The difficulty level of the block (relevant in PoW chains). | [packages/actions/src/common/Block.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/Block.ts#L25) |
| <a id="gaslimit"></a> `gasLimit` | `readonly` | `bigint` | The gas limit for the block, i.e., the maximum amount of gas that can be used by the transactions in the block. | [packages/actions/src/common/Block.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/Block.ts#L30) |
| <a id="number"></a> `number` | `readonly` | `bigint` | The block number (height) in the blockchain. | [packages/actions/src/common/Block.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/Block.ts#L10) |
| <a id="timestamp"></a> `timestamp` | `readonly` | `bigint` | The timestamp at which the block was mined or validated. | [packages/actions/src/common/Block.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/Block.ts#L20) |
