[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [tx](../README.md) / EIP4844CompatibleTx

# Interface: EIP4844CompatibleTx\<T\>

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:155

## Extends

- [`EIP1559CompatibleTx`](EIP1559CompatibleTx.md)\<`T`\>

## Type Parameters

### T

`T` *extends* [`TransactionType`](../enumerations/TransactionType.md) = [`TransactionType`](../enumerations/TransactionType.md)

## Properties

### accessList

> `readonly` **accessList**: `AccessListBytes`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:148

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`accessList`](EIP1559CompatibleTx.md#accesslist)

***

### AccessListJSON

> `readonly` **AccessListJSON**: [`AccessList`](../type-aliases/AccessList.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:149

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`AccessListJSON`](EIP1559CompatibleTx.md#accesslistjson)

***

### blobs?

> `optional` **blobs**: `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:158

***

### blobVersionedHashes

> **blobVersionedHashes**: `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:157

***

### cache

> `readonly` **cache**: `TransactionCache`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:118

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`cache`](EIP1559CompatibleTx.md#cache)

***

### chainId

> `readonly` **chainId**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:144

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`chainId`](EIP1559CompatibleTx.md#chainid)

***

### common

> `readonly` **common**: `Common`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:109

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`common`](EIP1559CompatibleTx.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:114

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`data`](EIP1559CompatibleTx.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:111

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`gasLimit`](EIP1559CompatibleTx.md#gaslimit)

***

### kzgCommitments?

> `optional` **kzgCommitments**: `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:159

***

### kzgProofs?

> `optional` **kzgProofs**: `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:160

***

### maxFeePerBlobGas

> `readonly` **maxFeePerBlobGas**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:156

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:153

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`maxFeePerGas`](EIP1559CompatibleTx.md#maxfeepergas)

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:152

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`maxPriorityFeePerGas`](EIP1559CompatibleTx.md#maxpriorityfeepergas)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:110

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`nonce`](EIP1559CompatibleTx.md#nonce)

***

### r?

> `readonly` `optional` **r**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:116

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`r`](EIP1559CompatibleTx.md#r)

***

### s?

> `readonly` `optional` **s**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:117

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`s`](EIP1559CompatibleTx.md#s)

***

### to?

> `readonly` `optional` **to**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:112

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`to`](EIP1559CompatibleTx.md#to)

***

### type

> **type**: [`TransactionType`](../enumerations/TransactionType.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:120

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`type`](EIP1559CompatibleTx.md#type)

***

### v?

> `readonly` `optional` **v**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:115

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`v`](EIP1559CompatibleTx.md#v)

***

### value

> `readonly` **value**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:113

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`value`](EIP1559CompatibleTx.md#value)

## Methods

### errorStr()

> **errorStr**(): `string`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:139

#### Returns

`string`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`errorStr`](EIP1559CompatibleTx.md#errorstr)

***

### getBaseFee()

> **getBaseFee**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:121

#### Returns

`bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getBaseFee`](EIP1559CompatibleTx.md#getbasefee)

***

### getDataFee()

> **getDataFee**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:122

#### Returns

`bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getDataFee`](EIP1559CompatibleTx.md#getdatafee)

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:128

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getHashedMessageToSign`](EIP1559CompatibleTx.md#gethashedmessagetosign)

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:145

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getMessageToSign`](EIP1559CompatibleTx.md#getmessagetosign)

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:130

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getMessageToVerifySignature`](EIP1559CompatibleTx.md#getmessagetoverifysignature)

***

### getSenderAddress()

> **getSenderAddress**(): [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:135

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getSenderAddress`](EIP1559CompatibleTx.md#getsenderaddress)

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:136

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getSenderPublicKey`](EIP1559CompatibleTx.md#getsenderpublickey)

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:123

#### Returns

`bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getUpfrontCost`](EIP1559CompatibleTx.md#getupfrontcost)

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:131

#### Returns

`string`[]

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getValidationErrors`](EIP1559CompatibleTx.md#getvalidationerrors)

***

### hash()

> **hash**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:129

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`hash`](EIP1559CompatibleTx.md#hash)

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:132

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`isSigned`](EIP1559CompatibleTx.md#issigned)

***

### isValid()

> **isValid**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:133

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`isValid`](EIP1559CompatibleTx.md#isvalid)

***

### numBlobs()

> **numBlobs**(): `number`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:162

#### Returns

`number`

***

### raw()

> **raw**(): `TxValuesArray`\[`T`\]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:125

#### Returns

`TxValuesArray`\[`T`\]

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`raw`](EIP1559CompatibleTx.md#raw)

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:126

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`serialize`](EIP1559CompatibleTx.md#serialize)

***

### serializeNetworkWrapper()

> **serializeNetworkWrapper**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:161

#### Returns

`Uint8Array`

***

### sign()

> **sign**(`privateKey`): `Transaction`\[`T`\]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:137

#### Parameters

##### privateKey

`Uint8Array`

#### Returns

`Transaction`\[`T`\]

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`sign`](EIP1559CompatibleTx.md#sign)

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:119

#### Parameters

##### capability

[`Capability`](../enumerations/Capability.md)

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`supports`](EIP1559CompatibleTx.md#supports)

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:124

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`toCreationAddress`](EIP1559CompatibleTx.md#tocreationaddress)

***

### toJSON()

> **toJSON**(): [`JsonTx`](JsonTx.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:138

#### Returns

[`JsonTx`](JsonTx.md)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`toJSON`](EIP1559CompatibleTx.md#tojson)

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:134

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`verifySignature`](EIP1559CompatibleTx.md#verifysignature)
