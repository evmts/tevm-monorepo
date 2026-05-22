[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthFeeHistoryParams

# Type Alias: EthFeeHistoryParams

> **EthFeeHistoryParams** = `object`

Based on the JSON-RPC request for `eth_feeHistory` procedure

## Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="blockcount"></a> `blockCount` | `readonly` | `bigint` | Number of blocks in the requested range. Between 1 and 1024 blocks can be requested in a single query. |
| <a id="newestblock"></a> `newestBlock` | `readonly` | [`BlockParam`](../../index/type-aliases/BlockParam.md) | Highest block number of the requested range as a block tag or block number. |
| <a id="rewardpercentiles"></a> `rewardPercentiles?` | `readonly` | readonly `number`[] | A monotonically increasing list of percentile values to sample from each block's effective priority fees per gas in ascending order, weighted by gas used. |
