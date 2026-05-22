[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthFeeHistoryResult

# Type Alias: EthFeeHistoryResult

> **EthFeeHistoryResult** = `object`

JSON-RPC response for `eth_feeHistory` procedure

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="basefeepergas"></a> `baseFeePerGas` | `bigint`[] | An array of block base fees per gas. This includes the next block after the newest of the returned range, because this value can be derived from the newest block. Zeroes are returned for pre-EIP-1559 blocks. |
| <a id="gasusedratio"></a> `gasUsedRatio` | `number`[] | An array of block gas used ratios. These are calculated as the ratio of gasUsed and gasLimit. |
| <a id="oldestblock"></a> `oldestBlock` | `bigint` | Lowest number block of the returned range. |
| <a id="reward"></a> `reward?` | `bigint`[][] | An array of effective priority fee per gas data points from a single block. All zeroes are returned if the block is empty. |
