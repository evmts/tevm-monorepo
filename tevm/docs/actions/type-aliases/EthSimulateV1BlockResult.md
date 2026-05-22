[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthSimulateV1BlockResult

# Type Alias: EthSimulateV1BlockResult

> **EthSimulateV1BlockResult** = `object`

Result of a simulated block containing multiple call results

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="basefeepergas"></a> `baseFeePerGas?` | `bigint` | The base fee per gas for the block |
| <a id="calls"></a> `calls` | [`EthSimulateV1CallResult`](EthSimulateV1CallResult.md)[] | Results of the simulated calls in this block |
| <a id="gaslimit"></a> `gasLimit` | `bigint` | The gas limit of the block |
| <a id="gasused"></a> `gasUsed` | `bigint` | The gas used in the block |
| <a id="hash"></a> `hash` | [`Hex`](Hex.md) | The block hash |
| <a id="number"></a> `number` | `bigint` | The block number |
| <a id="timestamp"></a> `timestamp` | `bigint` | The timestamp of the block |
