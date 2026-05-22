[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / JsonRpcTransaction

# Type Alias: JsonRpcTransaction

> **JsonRpcTransaction** = `object`

the transaction call object for methods like `eth_call`

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="data"></a> `data?` | [`Hex`](../../index/type-aliases/Hex.md) | The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation |
| <a id="from"></a> `from?` | [`Address`](../../index/type-aliases/Address.md) | The address from which the transaction is sent |
| <a id="gas"></a> `gas?` | [`Hex`](../../index/type-aliases/Hex.md) | The integer of gas provided for the transaction execution |
| <a id="gasprice"></a> `gasPrice?` | [`Hex`](../../index/type-aliases/Hex.md) | The integer of gasPrice used for each paid gas encoded as hexadecimal |
| <a id="nonce"></a> `nonce?` | [`Hex`](../../index/type-aliases/Hex.md) | The integer of the nonce. If not provided a nonce will automatically be generated |
| <a id="to"></a> `to?` | [`Address`](../../index/type-aliases/Address.md) | The address to which the transaction is addressed |
| <a id="value"></a> `value?` | [`Hex`](../../index/type-aliases/Hex.md) | The integer of value sent with this transaction encoded as hexadecimal |
