[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / Block

# Type Alias: Block

> **Block** = `object`

Header information of an ethereum block

## Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="basefeepergas"></a> `baseFeePerGas?` | `readonly` | `bigint` | (Optional) The base fee per gas in the block, introduced in EIP-1559 for dynamic transaction fee calculation. |
| <a id="blobgasprice"></a> `blobGasPrice?` | `readonly` | `bigint` | The gas price for the block; may be undefined in blocks after EIP-1559. |
| <a id="coinbase"></a> `coinbase` | `readonly` | [`Address`](Address.md) | The address of the miner or validator who mined or validated the block. |
| <a id="difficulty"></a> `difficulty` | `readonly` | `bigint` | The difficulty level of the block (relevant in PoW chains). |
| <a id="gaslimit"></a> `gasLimit` | `readonly` | `bigint` | The gas limit for the block, i.e., the maximum amount of gas that can be used by the transactions in the block. |
| <a id="number"></a> `number` | `readonly` | `bigint` | The block number (height) in the blockchain. |
| <a id="timestamp"></a> `timestamp` | `readonly` | `bigint` | The timestamp at which the block was mined or validated. |
