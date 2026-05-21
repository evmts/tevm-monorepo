[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / EIP1559CompatibleTx

# Interface: EIP1559CompatibleTx\<T\>

## Extends

- `EIP2930CompatibleTx`\<`T`\>

## Extended by

- [`EIP4844CompatibleTx`](EIP4844CompatibleTx.md)

## Type Parameters

### T

`T` *extends* [`TransactionType`](../type-aliases/TransactionType.md) = [`TransactionType`](../type-aliases/TransactionType.md)

## Properties

### accessList

> `readonly` **accessList**: `AccessListBytes`

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`accessList`](EIP4844CompatibleTx.md#accesslist)

***

### cache

> `readonly` **cache**: `TransactionCache`

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`cache`](EIP4844CompatibleTx.md#cache)

***

### chainId

> `readonly` **chainId**: `bigint`

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`chainId`](EIP4844CompatibleTx.md#chainid)

***

### common

> `readonly` **common**: `Common`

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`common`](EIP4844CompatibleTx.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`data`](EIP4844CompatibleTx.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`gasLimit`](EIP4844CompatibleTx.md#gaslimit)

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

***

### nonce

> `readonly` **nonce**: `bigint`

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`nonce`](EIP4844CompatibleTx.md#nonce)

***

### r?

> `readonly` `optional` **r?**: `bigint`

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`r`](EIP4844CompatibleTx.md#r)

***

### s?

> `readonly` `optional` **s?**: `bigint`

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`s`](EIP4844CompatibleTx.md#s)

***

### to?

> `readonly` `optional` **to?**: `Address`

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`to`](EIP4844CompatibleTx.md#to)

***

### txOptions

> **txOptions**: [`TxOptions`](TxOptions.md)

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`txOptions`](EIP4844CompatibleTx.md#txoptions)

***

### type

> **type**: [`TransactionType`](../type-aliases/TransactionType.md)

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`type`](EIP4844CompatibleTx.md#type)

***

### v?

> `readonly` `optional` **v?**: `bigint`

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`v`](EIP4844CompatibleTx.md#v)

***

### value

> `readonly` **value**: `bigint`

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`value`](EIP4844CompatibleTx.md#value)

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`, `convertV?`): `Transaction`\[`T`\]

#### Parameters

##### v

`bigint`

##### r

`bigint` \| `Uint8Array`\<`ArrayBufferLike`\>

##### s

`bigint` \| `Uint8Array`\<`ArrayBufferLike`\>

##### convertV?

`boolean`

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

##### privateKey

`Uint8Array`

##### extraEntropy?

`boolean` \| `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`Transaction`\[`T`\]

#### Inherited from

`EIP2930CompatibleTx.sign`

***

### supports()

> **supports**(`capability`): `boolean`

#### Parameters

##### capability

`number`

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
