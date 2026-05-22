[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [tx](../README.md) / JsonTx

# Interface: JsonTx

Generic interface for all tx types with a
JSON representation of a transaction.

Note that all values are marked as optional
and not all the values are present on all tx types
(an EIP1559 tx e.g. lacks a `gasPrice`).

## Properties

| Property | Type |
| ------ | ------ |
| <a id="accesslist"></a> `accessList?` | `JSONAccessListItem`[] |
| <a id="authorizationlist"></a> `authorizationList?` | `EOACode7702AuthorizationList` |
| <a id="blobversionedhashes"></a> `blobVersionedHashes?` | `` `0x${string}` ``[] |
| <a id="chainid"></a> `chainId?` | `` `0x${string}` `` |
| <a id="data"></a> `data?` | `` `0x${string}` `` |
| <a id="gaslimit"></a> `gasLimit?` | `` `0x${string}` `` |
| <a id="gasprice"></a> `gasPrice?` | `` `0x${string}` `` |
| <a id="maxfeeperblobgas"></a> `maxFeePerBlobGas?` | `` `0x${string}` `` |
| <a id="maxfeepergas"></a> `maxFeePerGas?` | `` `0x${string}` `` |
| <a id="maxpriorityfeepergas"></a> `maxPriorityFeePerGas?` | `` `0x${string}` `` |
| <a id="nonce"></a> `nonce?` | `` `0x${string}` `` |
| <a id="r"></a> `r?` | `` `0x${string}` `` |
| <a id="s"></a> `s?` | `` `0x${string}` `` |
| <a id="to"></a> `to?` | `` `0x${string}` `` |
| <a id="type"></a> `type?` | `` `0x${string}` `` |
| <a id="v"></a> `v?` | `` `0x${string}` `` |
| <a id="value"></a> `value?` | `` `0x${string}` `` |
| <a id="yparity"></a> `yParity?` | `` `0x${string}` `` |
