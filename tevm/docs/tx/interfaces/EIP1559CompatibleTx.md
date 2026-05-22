[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [tx](../README.md) / EIP1559CompatibleTx

# Interface: EIP1559CompatibleTx\<T\>

## Extends

- `EIP2930CompatibleTx`\<`T`\>

## Extended by

- [`EIP4844CompatibleTx`](EIP4844CompatibleTx.md)

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`TransactionType`](../type-aliases/TransactionType.md) | [`TransactionType`](../type-aliases/TransactionType.md) |

## Properties

| Property | Modifier | Type | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="accesslist"></a> `accessList` | `readonly` | `AccessListBytes` | [`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`accessList`](EIP4844CompatibleTx.md#accesslist) |
| <a id="cache"></a> `cache` | `readonly` | `TransactionCache` | [`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`cache`](EIP4844CompatibleTx.md#cache) |
| <a id="chainid"></a> `chainId` | `readonly` | `bigint` | [`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`chainId`](EIP4844CompatibleTx.md#chainid) |
| <a id="common"></a> `common` | `readonly` | `Common` | [`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`common`](EIP4844CompatibleTx.md#common) |
| <a id="data"></a> `data` | `readonly` | `Uint8Array` | [`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`data`](EIP4844CompatibleTx.md#data) |
| <a id="gaslimit"></a> `gasLimit` | `readonly` | `bigint` | [`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`gasLimit`](EIP4844CompatibleTx.md#gaslimit) |
| <a id="maxfeepergas"></a> `maxFeePerGas` | `readonly` | `bigint` | - |
| <a id="maxpriorityfeepergas"></a> `maxPriorityFeePerGas` | `readonly` | `bigint` | - |
| <a id="nonce"></a> `nonce` | `readonly` | `bigint` | [`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`nonce`](EIP4844CompatibleTx.md#nonce) |
| <a id="r"></a> `r?` | `readonly` | `bigint` | [`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`r`](EIP4844CompatibleTx.md#r) |
| <a id="s"></a> `s?` | `readonly` | `bigint` | [`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`s`](EIP4844CompatibleTx.md#s) |
| <a id="to"></a> `to?` | `readonly` | `Address` | [`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`to`](EIP4844CompatibleTx.md#to) |
| <a id="txoptions"></a> `txOptions` | `public` | [`TxOptions`](TxOptions.md) | [`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`txOptions`](EIP4844CompatibleTx.md#txoptions) |
| <a id="type"></a> `type` | `public` | [`TransactionType`](../type-aliases/TransactionType.md) | [`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`type`](EIP4844CompatibleTx.md#type) |
| <a id="v"></a> `v?` | `readonly` | `bigint` | [`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`v`](EIP4844CompatibleTx.md#v) |
| <a id="value"></a> `value` | `readonly` | `bigint` | [`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`value`](EIP4844CompatibleTx.md#value) |

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`, `convertV?`): `Transaction`\[`T`\]

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `bigint` |
| `r` | `bigint` \| `Uint8Array`\<`ArrayBufferLike`\> |
| `s` | `bigint` \| `Uint8Array`\<`ArrayBufferLike`\> |
| `convertV?` | `boolean` |

#### Returns

`Transaction`\[`T`\]

#### Inherited from

`EIP2930CompatibleTx.addSignature`

***

### errorStr()

> **errorStr**(): `string`

#### Returns

`string`

#### Inherited from

`EIP2930CompatibleTx.errorStr`

***

### getDataGas()

> **getDataGas**(): `bigint`

#### Returns

`bigint`

#### Inherited from

`EIP2930CompatibleTx.getDataGas`

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.getHashedMessageToSign`

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

#### Returns

`bigint`

#### Inherited from

`EIP2930CompatibleTx.getIntrinsicGas`

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.getMessageToSign`

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.getMessageToVerifySignature`

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

#### Returns

`Address`

#### Inherited from

`EIP2930CompatibleTx.getSenderAddress`

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.getSenderPublicKey`

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

#### Returns

`bigint`

#### Inherited from

`EIP2930CompatibleTx.getUpfrontCost`

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

#### Returns

`string`[]

#### Inherited from

`EIP2930CompatibleTx.getValidationErrors`

***

### hash()

> **hash**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.hash`

***

### isSigned()

> **isSigned**(): `boolean`

#### Returns

`boolean`

#### Inherited from

`EIP2930CompatibleTx.isSigned`

***

### isValid()

> **isValid**(): `boolean`

#### Returns

`boolean`

#### Inherited from

`EIP2930CompatibleTx.isValid`

***

### raw()

> **raw**(): `TxValuesArray`\[`T`\]

#### Returns

`TxValuesArray`\[`T`\]

#### Inherited from

`EIP2930CompatibleTx.raw`

***

### serialize()

> **serialize**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.serialize`

***

### sign()

> **sign**(`privateKey`, `extraEntropy?`): `Transaction`\[`T`\]

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `privateKey` | `Uint8Array` |
| `extraEntropy?` | `boolean` \| `Uint8Array`\<`ArrayBufferLike`\> |

#### Returns

`Transaction`\[`T`\]

#### Inherited from

`EIP2930CompatibleTx.sign`

***

### supports()

> **supports**(`capability`): `boolean`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `capability` | `number` |

#### Returns

`boolean`

#### Inherited from

`EIP2930CompatibleTx.supports`

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

#### Returns

`boolean`

#### Inherited from

`EIP2930CompatibleTx.toCreationAddress`

***

### toJSON()

> **toJSON**(): [`JsonTx`](JsonTx.md)

#### Returns

[`JsonTx`](JsonTx.md)

#### Inherited from

`EIP2930CompatibleTx.toJSON`

***

### verifySignature()

> **verifySignature**(): `boolean`

#### Returns

`boolean`

#### Inherited from

`EIP2930CompatibleTx.verifySignature`
