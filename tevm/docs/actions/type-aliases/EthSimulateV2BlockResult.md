[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthSimulateV2BlockResult

# Type Alias: EthSimulateV2BlockResult

> **EthSimulateV2BlockResult** = `object`

Result of a simulated block containing multiple call results (V2)
Extends V1 with streamlined output

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="basefeepergas"></a> `baseFeePerGas?` | `bigint` | The base fee per gas for the block |
| <a id="calls"></a> `calls` | [`EthSimulateV2CallResult`](EthSimulateV2CallResult.md)[] | Results of the simulated calls in this block |
| <a id="feerecipient"></a> `feeRecipient?` | [`Address`](Address.md) | The fee recipient (coinbase) |
| <a id="gaslimit"></a> `gasLimit` | `bigint` | The gas limit of the block |
| <a id="gasused"></a> `gasUsed` | `bigint` | The gas used in the block |
| <a id="hash"></a> `hash` | [`Hex`](Hex.md) | The block hash |
| <a id="number"></a> `number` | `bigint` | The block number |
| <a id="timestamp"></a> `timestamp` | `bigint` | The timestamp of the block |
