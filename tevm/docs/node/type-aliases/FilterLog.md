[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [node](../README.md) / FilterLog

# Type Alias: FilterLog

> **FilterLog** = `object`

Log entry stored in a filter
Uses bigint for blockNumber, logIndex, and transactionIndex for consistency with TEVM's internal types

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="address"></a> `address` | [`Hex`](../../index/type-aliases/Hex.md) | Address that emitted the log |
| <a id="blockhash"></a> `blockHash` | [`Hex`](../../index/type-aliases/Hex.md) | Block hash containing the log |
| <a id="blocknumber"></a> `blockNumber` | `bigint` | Block number containing the log |
| <a id="data"></a> `data` | [`Hex`](../../index/type-aliases/Hex.md) | Non-indexed log data |
| <a id="logindex"></a> `logIndex` | `bigint` | Index of the log within the block |
| <a id="removed"></a> `removed` | `boolean` | Whether the log was removed due to a chain reorganization |
| <a id="topics"></a> `topics` | \[[`Hex`](../../index/type-aliases/Hex.md), `...Hex[]`\] | Indexed log topics |
| <a id="transactionhash"></a> `transactionHash` | [`Hex`](../../index/type-aliases/Hex.md) | Transaction hash that created the log |
| <a id="transactionindex"></a> `transactionIndex` | `bigint` | Index of the transaction within the block |
