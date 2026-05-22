[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthSignTransactionParams

# Type Alias: EthSignTransactionParams

> **EthSignTransactionParams** = `object`

**`Experimental`**

Based on the JSON-RPC request for `eth_signTransaction` procedure

## Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="accesslist"></a> `accessList?` | `readonly` | readonly `object`[] | - |
| <a id="authorizationlist"></a> `authorizationList?` | `readonly` | readonly `unknown`[] | - |
| <a id="blobversionedhashes"></a> `blobVersionedHashes?` | `readonly` | readonly [`Hex`](Hex.md)[] | - |
| <a id="data"></a> `data?` | `readonly` | [`Hex`](Hex.md) | The compiled code of a contract OR the hash of the invoked method signature and encoded parameters. Optional if creating a contract. |
| <a id="from"></a> `from` | `readonly` | [`Address`](Address.md) | The address from which the transaction is sent from |
| <a id="gas"></a> `gas?` | `readonly` | `bigint` | The gas provded for transaction execution. It will return unused gas. Default value is 90000 |
| <a id="gasprice"></a> `gasPrice?` | `readonly` | `bigint` | Integer of the gasPrice used for each paid gas, in Wei. If not provided tevm will default to the eth_gasPrice value |
| <a id="maxfeeperblobgas"></a> `maxFeePerBlobGas?` | `readonly` | `bigint` | - |
| <a id="maxfeepergas"></a> `maxFeePerGas?` | `readonly` | `bigint` | - |
| <a id="maxpriorityfeepergas"></a> `maxPriorityFeePerGas?` | `readonly` | `bigint` | - |
| <a id="nonce"></a> `nonce?` | `readonly` | `bigint` | Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce. |
| <a id="to"></a> `to?` | `readonly` | [`Address`](Address.md) | The address the transaction is directed to. Optional if creating a contract |
| <a id="type"></a> `type?` | `readonly` | `"legacy"` \| `"eip2930"` \| `"eip1559"` \| `"eip4844"` \| `"eip7702"` | - |
| <a id="value"></a> `value?` | `readonly` | `bigint` | Integer of the value sent with this transaction, in Wei. |
