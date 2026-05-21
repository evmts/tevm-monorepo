[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / EOACodeEIP7702TxData

# Interface: EOACodeEIP7702TxData

[EOACode7702Tx](../classes/EOACodeEIP7702Transaction.md) data.

## Extends

- `FeeMarketEIP1559TxData`

## Properties

### accessList?

> `optional` **accessList?**: `AccessListBytes` \| [`AccessList`](../type-aliases/AccessList.md) \| `null`

The access list which contains the addresses/storage slots which the transaction wishes to access

#### Inherited from

`FeeMarketEIP1559TxData.accessList`

***

### authorizationList?

> `optional` **authorizationList?**: `EOACode7702AuthorizationListBytes` \| `EOACode7702AuthorizationList`

***

### chainId?

> `optional` **chainId?**: `BigIntLike`

The transaction's chain ID

#### Inherited from

`FeeMarketEIP1559TxData.chainId`

***

### data?

> `optional` **data?**: `""` \| `BytesLike`

This will contain the data of the message or the init of a contract.

#### Inherited from

`FeeMarketEIP1559TxData.data`

***

### gasLimit?

> `optional` **gasLimit?**: `BigIntLike`

The transaction's gas limit.

#### Inherited from

`FeeMarketEIP1559TxData.gasLimit`

***

### gasPrice?

> `optional` **gasPrice?**: `null`

The transaction's gas price, inherited from Transaction.  This property is not used for EIP1559
transactions and should always be undefined for this specific transaction type.

#### Inherited from

`FeeMarketEIP1559TxData.gasPrice`

***

### maxFeePerGas?

> `optional` **maxFeePerGas?**: `BigIntLike`

The maximum total fee

#### Inherited from

`FeeMarketEIP1559TxData.maxFeePerGas`

***

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas?**: `BigIntLike`

The maximum inclusion fee per gas (this fee is given to the miner)

#### Inherited from

`FeeMarketEIP1559TxData.maxPriorityFeePerGas`

***

### nonce?

> `optional` **nonce?**: `BigIntLike`

The transaction's nonce.

#### Inherited from

`FeeMarketEIP1559TxData.nonce`

***

### r?

> `optional` **r?**: `BigIntLike`

EC signature parameter.

#### Inherited from

`FeeMarketEIP1559TxData.r`

***

### s?

> `optional` **s?**: `BigIntLike`

EC signature parameter.

#### Inherited from

`FeeMarketEIP1559TxData.s`

***

### to?

> `optional` **to?**: `""` \| `AddressLike`

The transaction's the address is sent to.

#### Inherited from

`FeeMarketEIP1559TxData.to`

***

### type?

> `optional` **type?**: `BigIntLike`

The transaction type

#### Inherited from

`FeeMarketEIP1559TxData.type`

***

### v?

> `optional` **v?**: `BigIntLike`

EC recovery ID.

#### Inherited from

`FeeMarketEIP1559TxData.v`

***

### value?

> `optional` **value?**: `BigIntLike`

The amount of Ether sent.

#### Inherited from

`FeeMarketEIP1559TxData.value`
