[**@tevm/tx**](../README.md)

***

[@tevm/tx](../globals.md) / EIP4844CompatibleTx

# Interface: EIP4844CompatibleTx\<T\>

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:171

## Extends

- [`EIP1559CompatibleTx`](EIP1559CompatibleTx.md)\<`T`\>

## Type Parameters

• **T** *extends* [`TransactionType`](../enumerations/TransactionType.md) = [`TransactionType`](../enumerations/TransactionType.md)

## Properties

### accessList

> `readonly` **accessList**: `AccessListBytes`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:164

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`accessList`](EIP1559CompatibleTx.md#accesslist)

***

### AccessListJSON

> `readonly` **AccessListJSON**: [`AccessList`](../type-aliases/AccessList.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:165

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`AccessListJSON`](EIP1559CompatibleTx.md#accesslistjson)

***

### blobs?

> `optional` **blobs**: `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:174

***

### blobVersionedHashes

> **blobVersionedHashes**: `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:173

***

### cache

> `readonly` **cache**: `TransactionCache`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:134

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`cache`](EIP1559CompatibleTx.md#cache)

***

### chainId

> `readonly` **chainId**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:160

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`chainId`](EIP1559CompatibleTx.md#chainid)

***

### common

> `readonly` **common**: `Common`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:125

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`common`](EIP1559CompatibleTx.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:130

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`data`](EIP1559CompatibleTx.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:127

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`gasLimit`](EIP1559CompatibleTx.md#gaslimit)

***

### kzgCommitments?

> `optional` **kzgCommitments**: `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:175

***

### kzgProofs?

> `optional` **kzgProofs**: `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:176

***

### maxFeePerBlobGas

> `readonly` **maxFeePerBlobGas**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:172

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:169

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`maxFeePerGas`](EIP1559CompatibleTx.md#maxfeepergas)

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:168

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`maxPriorityFeePerGas`](EIP1559CompatibleTx.md#maxpriorityfeepergas)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:126

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`nonce`](EIP1559CompatibleTx.md#nonce)

***

### r?

> `readonly` `optional` **r**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:132

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`r`](EIP1559CompatibleTx.md#r)

***

### s?

> `readonly` `optional` **s**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:133

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`s`](EIP1559CompatibleTx.md#s)

***

### to?

> `readonly` `optional` **to**: `Address`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:128

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`to`](EIP1559CompatibleTx.md#to)

***

### type

> **type**: [`TransactionType`](../enumerations/TransactionType.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:136

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`type`](EIP1559CompatibleTx.md#type)

***

### v?

> `readonly` `optional` **v**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:131

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`v`](EIP1559CompatibleTx.md#v)

***

### value

> `readonly` **value**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:129

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`value`](EIP1559CompatibleTx.md#value)

## Methods

### errorStr()

> **errorStr**(): `string`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:155

#### Returns

`string`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`errorStr`](EIP1559CompatibleTx.md#errorstr)

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:138

#### Returns

`bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getDataGas`](EIP1559CompatibleTx.md#getdatagas)

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:144

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getHashedMessageToSign`](EIP1559CompatibleTx.md#gethashedmessagetosign)

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:137

#### Returns

`bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getIntrinsicGas`](EIP1559CompatibleTx.md#getintrinsicgas)

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:161

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getMessageToSign`](EIP1559CompatibleTx.md#getmessagetosign)

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:146

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getMessageToVerifySignature`](EIP1559CompatibleTx.md#getmessagetoverifysignature)

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:151

#### Returns

`Address`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getSenderAddress`](EIP1559CompatibleTx.md#getsenderaddress)

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:152

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getSenderPublicKey`](EIP1559CompatibleTx.md#getsenderpublickey)

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:139

#### Returns

`bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getUpfrontCost`](EIP1559CompatibleTx.md#getupfrontcost)

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:147

#### Returns

`string`[]

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getValidationErrors`](EIP1559CompatibleTx.md#getvalidationerrors)

***

### hash()

> **hash**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:145

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`hash`](EIP1559CompatibleTx.md#hash)

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:148

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`isSigned`](EIP1559CompatibleTx.md#issigned)

***

### isValid()

> **isValid**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:149

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`isValid`](EIP1559CompatibleTx.md#isvalid)

***

### numBlobs()

> **numBlobs**(): `number`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:178

#### Returns

`number`

***

### raw()

> **raw**(): `TxValuesArray`\[`T`\]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:141

#### Returns

`TxValuesArray`\[`T`\]

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`raw`](EIP1559CompatibleTx.md#raw)

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:142

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`serialize`](EIP1559CompatibleTx.md#serialize)

***

### serializeNetworkWrapper()

> **serializeNetworkWrapper**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:177

#### Returns

`Uint8Array`

***

### sign()

> **sign**(`privateKey`): `Transaction`\[`T`\]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:153

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

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:135

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

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:140

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`toCreationAddress`](EIP1559CompatibleTx.md#tocreationaddress)

***

### toJSON()

> **toJSON**(): [`JSONTx`](JSONTx.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:154

#### Returns

[`JSONTx`](JSONTx.md)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`toJSON`](EIP1559CompatibleTx.md#tojson)

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@6.0.0-alpha.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:150

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`verifySignature`](EIP1559CompatibleTx.md#verifysignature)
