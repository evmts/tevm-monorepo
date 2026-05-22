[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / EOACodeEIP7702TxData

# Interface: EOACodeEIP7702TxData

[EOACode7702Tx](../classes/EOACodeEIP7702Transaction.md) data.

## Extends

- `FeeMarketEIP1559TxData`

## Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="accesslist"></a> `accessList?` | `AccessListBytes` \| [`AccessList`](../type-aliases/AccessList.md) \| `null` | The access list which contains the addresses/storage slots which the transaction wishes to access | `FeeMarketEIP1559TxData.accessList` |
| <a id="authorizationlist"></a> `authorizationList?` | `EOACode7702AuthorizationListBytes` \| `EOACode7702AuthorizationList` | - | - |
| <a id="chainid"></a> `chainId?` | `BigIntLike` | The transaction's chain ID | `FeeMarketEIP1559TxData.chainId` |
| <a id="data"></a> `data?` | `""` \| `BytesLike` | This will contain the data of the message or the init of a contract. | `FeeMarketEIP1559TxData.data` |
| <a id="gaslimit"></a> `gasLimit?` | `BigIntLike` | The transaction's gas limit. | `FeeMarketEIP1559TxData.gasLimit` |
| <a id="gasprice"></a> `gasPrice?` | `null` | The transaction's gas price, inherited from Transaction. This property is not used for EIP1559 transactions and should always be undefined for this specific transaction type. | `FeeMarketEIP1559TxData.gasPrice` |
| <a id="maxfeepergas"></a> `maxFeePerGas?` | `BigIntLike` | The maximum total fee | `FeeMarketEIP1559TxData.maxFeePerGas` |
| <a id="maxpriorityfeepergas"></a> `maxPriorityFeePerGas?` | `BigIntLike` | The maximum inclusion fee per gas (this fee is given to the miner) | `FeeMarketEIP1559TxData.maxPriorityFeePerGas` |
| <a id="nonce"></a> `nonce?` | `BigIntLike` | The transaction's nonce. | `FeeMarketEIP1559TxData.nonce` |
| <a id="r"></a> `r?` | `BigIntLike` | EC signature parameter. | `FeeMarketEIP1559TxData.r` |
| <a id="s"></a> `s?` | `BigIntLike` | EC signature parameter. | `FeeMarketEIP1559TxData.s` |
| <a id="to"></a> `to?` | `""` \| `AddressLike` | The transaction's the address is sent to. | `FeeMarketEIP1559TxData.to` |
| <a id="type"></a> `type?` | `BigIntLike` | The transaction type | `FeeMarketEIP1559TxData.type` |
| <a id="v"></a> `v?` | `BigIntLike` | EC recovery ID. | `FeeMarketEIP1559TxData.v` |
| <a id="value"></a> `value?` | `BigIntLike` | The amount of Ether sent. | `FeeMarketEIP1559TxData.value` |
