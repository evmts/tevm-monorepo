[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthCallParams

# Type Alias: EthCallParams

> **EthCallParams** = `object`

Based on the JSON-RPC request for `eth_call` procedure

## Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="blockoverride"></a> `blockOverride?` | `readonly` | [`BlockOverrideSet`](BlockOverrideSet.md) | The block override set to provide different block values while executing the call |
| <a id="blocktag"></a> `blockTag?` | `readonly` | [`BlockParam`](../../index/type-aliases/BlockParam.md) | The block number hash or block tag |
| <a id="data"></a> `data?` | `readonly` | [`Hex`](Hex.md) | The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation Defaults to zero data |
| <a id="from"></a> `from?` | `readonly` | [`Address`](Address.md) | The address from which the transaction is sent. Defaults to zero address |
| <a id="gas"></a> `gas?` | `readonly` | `bigint` | The integer of gas provided for the transaction execution |
| <a id="gasprice"></a> `gasPrice?` | `readonly` | `bigint` | The integer of gasPrice used for each paid gas |
| <a id="stateoverrideset"></a> `stateOverrideSet?` | `readonly` | [`StateOverrideSet`](StateOverrideSet.md) | The state override set to provide different state values while executing the call |
| <a id="to"></a> `to?` | `readonly` | [`Address`](Address.md) | The address to which the transaction is addressed. Defaults to zero address |
| <a id="value"></a> `value?` | `readonly` | `bigint` | The integer of value sent with this transaction |
