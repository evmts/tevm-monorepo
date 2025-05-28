[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [tx](../README.md) / EIP4844CompatibleTx

# Interface: EIP4844CompatibleTx\<T\>

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:169

## Extends

- [`EIP1559CompatibleTx`](EIP1559CompatibleTx.md)\<`T`\>

## Type Parameters

### T

`T` *extends* [`TransactionType`](../type-aliases/TransactionType.md) = [`TransactionType`](../type-aliases/TransactionType.md)

## Properties

### accessList

> `readonly` **accessList**: `AccessListBytes`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:163

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`accessList`](EIP1559CompatibleTx.md#accesslist)

***

### blobs?

> `optional` **blobs**: `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:172

***

### blobVersionedHashes

> **blobVersionedHashes**: `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:171

***

### cache

> `readonly` **cache**: `TransactionCache`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:131

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`cache`](EIP1559CompatibleTx.md#cache)

***

### chainId

> `readonly` **chainId**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:159

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`chainId`](EIP1559CompatibleTx.md#chainid)

***

### common

> `readonly` **common**: `Common`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:122

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`common`](EIP1559CompatibleTx.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:127

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`data`](EIP1559CompatibleTx.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:124

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`gasLimit`](EIP1559CompatibleTx.md#gaslimit)

***

### kzgCommitments?

> `optional` **kzgCommitments**: `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:173

***

### kzgProofs?

> `optional` **kzgProofs**: `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:174

***

### maxFeePerBlobGas

> `readonly` **maxFeePerBlobGas**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:170

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:167

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`maxFeePerGas`](EIP1559CompatibleTx.md#maxfeepergas)

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:166

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`maxPriorityFeePerGas`](EIP1559CompatibleTx.md#maxpriorityfeepergas)

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:123

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`nonce`](EIP1559CompatibleTx.md#nonce)

***

### r?

> `readonly` `optional` **r**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:129

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`r`](EIP1559CompatibleTx.md#r)

***

### s?

> `readonly` `optional` **s**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:130

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`s`](EIP1559CompatibleTx.md#s)

***

### to?

> `readonly` `optional` **to**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:125

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`to`](EIP1559CompatibleTx.md#to)

***

### txOptions

> **txOptions**: [`TxOptions`](TxOptions.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:134

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`txOptions`](EIP1559CompatibleTx.md#txoptions)

***

### type

> **type**: [`TransactionType`](../type-aliases/TransactionType.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:133

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`type`](EIP1559CompatibleTx.md#type)

***

### v?

> `readonly` `optional` **v**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:128

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`v`](EIP1559CompatibleTx.md#v)

***

### value

> `readonly` **value**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:126

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`value`](EIP1559CompatibleTx.md#value)

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`, `convertV?`): `Transaction`\[`T`\]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:154

#### Parameters

##### v

`bigint`

##### r

`bigint` | `Uint8Array`\<`ArrayBufferLike`\>

##### s

`bigint` | `Uint8Array`\<`ArrayBufferLike`\>

##### convertV?

`boolean`

#### Returns

`Transaction`\[`T`\]

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`addSignature`](EIP1559CompatibleTx.md#addsignature)

***

### errorStr()

> **errorStr**(): `string`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:153

#### Returns

`string`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`errorStr`](EIP1559CompatibleTx.md#errorstr)

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:136

#### Returns

`bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getDataGas`](EIP1559CompatibleTx.md#getdatagas)

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:142

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getHashedMessageToSign`](EIP1559CompatibleTx.md#gethashedmessagetosign)

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:135

#### Returns

`bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getIntrinsicGas`](EIP1559CompatibleTx.md#getintrinsicgas)

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:160

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getMessageToSign`](EIP1559CompatibleTx.md#getmessagetosign)

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:144

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getMessageToVerifySignature`](EIP1559CompatibleTx.md#getmessagetoverifysignature)

***

### getSenderAddress()

> **getSenderAddress**(): [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:149

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getSenderAddress`](EIP1559CompatibleTx.md#getsenderaddress)

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:150

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getSenderPublicKey`](EIP1559CompatibleTx.md#getsenderpublickey)

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:137

#### Returns

`bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getUpfrontCost`](EIP1559CompatibleTx.md#getupfrontcost)

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:145

#### Returns

`string`[]

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getValidationErrors`](EIP1559CompatibleTx.md#getvalidationerrors)

***

### hash()

> **hash**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:143

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`hash`](EIP1559CompatibleTx.md#hash)

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:146

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`isSigned`](EIP1559CompatibleTx.md#issigned)

***

### isValid()

> **isValid**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:147

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`isValid`](EIP1559CompatibleTx.md#isvalid)

***

### numBlobs()

> **numBlobs**(): `number`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:176

#### Returns

`number`

***

### raw()

> **raw**(): `TxValuesArray`\[`T`\]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:139

#### Returns

`TxValuesArray`\[`T`\]

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`raw`](EIP1559CompatibleTx.md#raw)

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:140

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`serialize`](EIP1559CompatibleTx.md#serialize)

***

### serializeNetworkWrapper()

> **serializeNetworkWrapper**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:175

#### Returns

`Uint8Array`

***

### sign()

> **sign**(`privateKey`, `extraEntropy?`): `Transaction`\[`T`\]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:151

#### Parameters

##### privateKey

`Uint8Array`

##### extraEntropy?

`boolean` | `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`Transaction`\[`T`\]

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`sign`](EIP1559CompatibleTx.md#sign)

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:132

#### Parameters

##### capability

`number`

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`supports`](EIP1559CompatibleTx.md#supports)

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:138

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`toCreationAddress`](EIP1559CompatibleTx.md#tocreationaddress)

***

### toJSON()

> **toJSON**(): [`JsonTx`](JsonTx.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:152

#### Returns

[`JsonTx`](JsonTx.md)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`toJSON`](EIP1559CompatibleTx.md#tojson)

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:148

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`verifySignature`](EIP1559CompatibleTx.md#verifysignature)
