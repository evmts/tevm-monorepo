[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / TransactionReceiptResult

# Type Alias: TransactionReceiptResult

> **TransactionReceiptResult** = `object`

Transaction receipt result type for eth JSON-RPC procedures

## Properties

| Property | Modifier | Type |
| ------ | ------ | ------ |
| <a id="blobgasprice"></a> `blobGasPrice?` | `readonly` | `bigint` |
| <a id="blobgasused"></a> `blobGasUsed?` | `readonly` | `bigint` |
| <a id="blockhash"></a> `blockHash` | `readonly` | [`Hex`](Hex.md) |
| <a id="blocknumber"></a> `blockNumber` | `readonly` | `bigint` |
| <a id="contractaddress"></a> `contractAddress` | `readonly` | [`Hex`](Hex.md) \| `null` |
| <a id="cumulativegasused"></a> `cumulativeGasUsed` | `readonly` | `bigint` |
| <a id="effectivegasprice"></a> `effectiveGasPrice` | `readonly` | `bigint` |
| <a id="from"></a> `from` | `readonly` | [`Hex`](Hex.md) |
| <a id="gasused"></a> `gasUsed` | `readonly` | `bigint` |
| <a id="logs"></a> `logs` | `readonly` | readonly [`FilterLog`](FilterLog.md)[] |
| <a id="logsbloom"></a> `logsBloom` | `readonly` | [`Hex`](Hex.md) |
| <a id="root"></a> `root?` | `readonly` | [`Hex`](Hex.md) |
| <a id="status"></a> `status?` | `readonly` | [`Hex`](Hex.md) |
| <a id="to"></a> `to` | `readonly` | [`Hex`](Hex.md) \| `null` |
| <a id="transactionhash"></a> `transactionHash` | `readonly` | [`Hex`](Hex.md) |
| <a id="transactionindex"></a> `transactionIndex` | `readonly` | `bigint` |
