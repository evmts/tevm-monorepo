[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthSimulateV1Call

# Type Alias: EthSimulateV1Call

> **EthSimulateV1Call** = `object`

Parameters for a single simulated call within a block

## Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="data"></a> `data?` | `readonly` | [`Hex`](Hex.md) | The hash of the method signature and encoded parameters |
| <a id="from"></a> `from?` | `readonly` | [`Address`](Address.md) | The address from which the transaction is sent |
| <a id="gas"></a> `gas?` | `readonly` | `bigint` | The integer of gas provided for the transaction execution |
| <a id="gasprice"></a> `gasPrice?` | `readonly` | `bigint` | The integer of gasPrice used for each paid gas |
| <a id="maxfeepergas"></a> `maxFeePerGas?` | `readonly` | `bigint` | The max fee per gas (EIP-1559) |
| <a id="maxpriorityfeepergas"></a> `maxPriorityFeePerGas?` | `readonly` | `bigint` | The max priority fee per gas (EIP-1559) |
| <a id="nonce"></a> `nonce?` | `readonly` | `bigint` | The nonce of the transaction |
| <a id="to"></a> `to?` | `readonly` | [`Address`](Address.md) | The address to which the transaction is addressed |
| <a id="value"></a> `value?` | `readonly` | `bigint` | The integer of value sent with this transaction |
