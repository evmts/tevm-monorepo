[**@tevm/tx**](../README.md) • **Docs**

***

[@tevm/tx](../globals.md) / EIP4844CompatibleTx

# Interface: EIP4844CompatibleTx\<T\>

## Extends

- [`EIP1559CompatibleTx`](EIP1559CompatibleTx.md)\<`T`\>

## Type Parameters

• **T** *extends* [`TransactionType`](../enumerations/TransactionType.md) = [`TransactionType`](../enumerations/TransactionType.md)

## Properties

### accessList

> `readonly` **accessList**: `AccessListBytes`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`accessList`](EIP1559CompatibleTx.md#accesslist)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:148

***

### AccessListJSON

> `readonly` **AccessListJSON**: [`AccessList`](../type-aliases/AccessList.md)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`AccessListJSON`](EIP1559CompatibleTx.md#accesslistjson)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:149

***

### blobs?

> `optional` **blobs**: `Uint8Array`[]

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:158

***

### blobVersionedHashes

> **blobVersionedHashes**: `Uint8Array`[]

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:157

***

### cache

> `readonly` **cache**: `TransactionCache`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`cache`](EIP1559CompatibleTx.md#cache)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:118

***

### chainId

> `readonly` **chainId**: `bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`chainId`](EIP1559CompatibleTx.md#chainid)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:144

***

### common

> `readonly` **common**: `Common`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`common`](EIP1559CompatibleTx.md#common)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:109

***

### data

> `readonly` **data**: `Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`data`](EIP1559CompatibleTx.md#data)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:114

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`gasLimit`](EIP1559CompatibleTx.md#gaslimit)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:111

***

### kzgCommitments?

> `optional` **kzgCommitments**: `Uint8Array`[]

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:159

***

### kzgProofs?

> `optional` **kzgProofs**: `Uint8Array`[]

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:160

***

### maxFeePerBlobGas

> `readonly` **maxFeePerBlobGas**: `bigint`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:156

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`maxFeePerGas`](EIP1559CompatibleTx.md#maxfeepergas)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:153

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`maxPriorityFeePerGas`](EIP1559CompatibleTx.md#maxpriorityfeepergas)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:152

***

### nonce

> `readonly` **nonce**: `bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`nonce`](EIP1559CompatibleTx.md#nonce)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:110

***

### r?

> `readonly` `optional` **r**: `bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`r`](EIP1559CompatibleTx.md#r)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:116

***

### s?

> `readonly` `optional` **s**: `bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`s`](EIP1559CompatibleTx.md#s)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:117

***

### to?

> `readonly` `optional` **to**: `Address`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`to`](EIP1559CompatibleTx.md#to)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:112

***

### type

> **type**: [`TransactionType`](../enumerations/TransactionType.md)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`type`](EIP1559CompatibleTx.md#type)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:120

***

### v?

> `readonly` `optional` **v**: `bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`v`](EIP1559CompatibleTx.md#v)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:115

***

### value

> `readonly` **value**: `bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`value`](EIP1559CompatibleTx.md#value)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:113

## Methods

### errorStr()

> **errorStr**(): `string`

#### Returns

`string`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`errorStr`](EIP1559CompatibleTx.md#errorstr)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:139

***

### getBaseFee()

> **getBaseFee**(): `bigint`

#### Returns

`bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getBaseFee`](EIP1559CompatibleTx.md#getbasefee)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:121

***

### getDataFee()

> **getDataFee**(): `bigint`

#### Returns

`bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getDataFee`](EIP1559CompatibleTx.md#getdatafee)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:122

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getHashedMessageToSign`](EIP1559CompatibleTx.md#gethashedmessagetosign)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:128

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getMessageToSign`](EIP1559CompatibleTx.md#getmessagetosign)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:145

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getMessageToVerifySignature`](EIP1559CompatibleTx.md#getmessagetoverifysignature)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:130

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

#### Returns

`Address`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getSenderAddress`](EIP1559CompatibleTx.md#getsenderaddress)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:135

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getSenderPublicKey`](EIP1559CompatibleTx.md#getsenderpublickey)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:136

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

#### Returns

`bigint`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getUpfrontCost`](EIP1559CompatibleTx.md#getupfrontcost)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:123

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

#### Returns

`string`[]

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`getValidationErrors`](EIP1559CompatibleTx.md#getvalidationerrors)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:131

***

### hash()

> **hash**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`hash`](EIP1559CompatibleTx.md#hash)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:129

***

### isSigned()

> **isSigned**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`isSigned`](EIP1559CompatibleTx.md#issigned)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:132

***

### isValid()

> **isValid**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`isValid`](EIP1559CompatibleTx.md#isvalid)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:133

***

### numBlobs()

> **numBlobs**(): `number`

#### Returns

`number`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:162

***

### raw()

> **raw**(): `TxValuesArray`\[`T`\]

#### Returns

`TxValuesArray`\[`T`\]

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`raw`](EIP1559CompatibleTx.md#raw)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:125

***

### serialize()

> **serialize**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`serialize`](EIP1559CompatibleTx.md#serialize)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:126

***

### serializeNetworkWrapper()

> **serializeNetworkWrapper**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:161

***

### sign()

> **sign**(`privateKey`): `Transaction`\[`T`\]

#### Parameters

• **privateKey**: `Uint8Array`

#### Returns

`Transaction`\[`T`\]

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`sign`](EIP1559CompatibleTx.md#sign)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:137

***

### supports()

> **supports**(`capability`): `boolean`

#### Parameters

• **capability**: [`Capability`](../enumerations/Capability.md)

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`supports`](EIP1559CompatibleTx.md#supports)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:119

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`toCreationAddress`](EIP1559CompatibleTx.md#tocreationaddress)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:124

***

### toJSON()

> **toJSON**(): [`JsonTx`](JsonTx.md)

#### Returns

[`JsonTx`](JsonTx.md)

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`toJSON`](EIP1559CompatibleTx.md#tojson)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:138

***

### verifySignature()

> **verifySignature**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](EIP1559CompatibleTx.md).[`verifySignature`](EIP1559CompatibleTx.md#verifysignature)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:134
