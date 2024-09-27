---
editUrl: false
next: false
prev: false
title: "EIP4844CompatibleTx"
---

## Extends

- [`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/)\<`T`\>

## Type Parameters

• **T** *extends* [`TransactionType`](/reference/tevm/tx/enumerations/transactiontype/) = [`TransactionType`](/reference/tevm/tx/enumerations/transactiontype/)

## Properties

### accessList

> `readonly` **accessList**: `AccessListBytes`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`accessList`](/reference/tevm/tx/interfaces/eip1559compatibletx/#accesslist)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:148

***

### AccessListJSON

> `readonly` **AccessListJSON**: [`AccessList`](/reference/tevm/tx/type-aliases/accesslist/)

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`AccessListJSON`](/reference/tevm/tx/interfaces/eip1559compatibletx/#accesslistjson)

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

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`cache`](/reference/tevm/tx/interfaces/eip1559compatibletx/#cache)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:118

***

### chainId

> `readonly` **chainId**: `bigint`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`chainId`](/reference/tevm/tx/interfaces/eip1559compatibletx/#chainid)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:144

***

### common

> `readonly` **common**: `Common`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`common`](/reference/tevm/tx/interfaces/eip1559compatibletx/#common)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:109

***

### data

> `readonly` **data**: `Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`data`](/reference/tevm/tx/interfaces/eip1559compatibletx/#data)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:114

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`gasLimit`](/reference/tevm/tx/interfaces/eip1559compatibletx/#gaslimit)

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

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`maxFeePerGas`](/reference/tevm/tx/interfaces/eip1559compatibletx/#maxfeepergas)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:153

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`maxPriorityFeePerGas`](/reference/tevm/tx/interfaces/eip1559compatibletx/#maxpriorityfeepergas)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:152

***

### nonce

> `readonly` **nonce**: `bigint`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`nonce`](/reference/tevm/tx/interfaces/eip1559compatibletx/#nonce)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:110

***

### r?

> `readonly` `optional` **r**: `bigint`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`r`](/reference/tevm/tx/interfaces/eip1559compatibletx/#r)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:116

***

### s?

> `readonly` `optional` **s**: `bigint`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`s`](/reference/tevm/tx/interfaces/eip1559compatibletx/#s)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:117

***

### to?

> `readonly` `optional` **to**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`to`](/reference/tevm/tx/interfaces/eip1559compatibletx/#to)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:112

***

### type

> **type**: [`TransactionType`](/reference/tevm/tx/enumerations/transactiontype/)

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`type`](/reference/tevm/tx/interfaces/eip1559compatibletx/#type)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:120

***

### v?

> `readonly` `optional` **v**: `bigint`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`v`](/reference/tevm/tx/interfaces/eip1559compatibletx/#v)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:115

***

### value

> `readonly` **value**: `bigint`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`value`](/reference/tevm/tx/interfaces/eip1559compatibletx/#value)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:113

## Methods

### errorStr()

> **errorStr**(): `string`

#### Returns

`string`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`errorStr`](/reference/tevm/tx/interfaces/eip1559compatibletx/#errorstr)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:139

***

### getBaseFee()

> **getBaseFee**(): `bigint`

#### Returns

`bigint`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`getBaseFee`](/reference/tevm/tx/interfaces/eip1559compatibletx/#getbasefee)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:121

***

### getDataFee()

> **getDataFee**(): `bigint`

#### Returns

`bigint`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`getDataFee`](/reference/tevm/tx/interfaces/eip1559compatibletx/#getdatafee)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:122

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`getHashedMessageToSign`](/reference/tevm/tx/interfaces/eip1559compatibletx/#gethashedmessagetosign)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:128

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`getMessageToSign`](/reference/tevm/tx/interfaces/eip1559compatibletx/#getmessagetosign)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:145

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`getMessageToVerifySignature`](/reference/tevm/tx/interfaces/eip1559compatibletx/#getmessagetoverifysignature)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:130

***

### getSenderAddress()

> **getSenderAddress**(): [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Returns

[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`getSenderAddress`](/reference/tevm/tx/interfaces/eip1559compatibletx/#getsenderaddress)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:135

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`getSenderPublicKey`](/reference/tevm/tx/interfaces/eip1559compatibletx/#getsenderpublickey)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:136

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

#### Returns

`bigint`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`getUpfrontCost`](/reference/tevm/tx/interfaces/eip1559compatibletx/#getupfrontcost)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:123

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

#### Returns

`string`[]

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`getValidationErrors`](/reference/tevm/tx/interfaces/eip1559compatibletx/#getvalidationerrors)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:131

***

### hash()

> **hash**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`hash`](/reference/tevm/tx/interfaces/eip1559compatibletx/#hash)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:129

***

### isSigned()

> **isSigned**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`isSigned`](/reference/tevm/tx/interfaces/eip1559compatibletx/#issigned)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:132

***

### isValid()

> **isValid**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`isValid`](/reference/tevm/tx/interfaces/eip1559compatibletx/#isvalid)

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

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`raw`](/reference/tevm/tx/interfaces/eip1559compatibletx/#raw)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:125

***

### serialize()

> **serialize**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`serialize`](/reference/tevm/tx/interfaces/eip1559compatibletx/#serialize)

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

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`sign`](/reference/tevm/tx/interfaces/eip1559compatibletx/#sign)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:137

***

### supports()

> **supports**(`capability`): `boolean`

#### Parameters

• **capability**: [`Capability`](/reference/tevm/tx/enumerations/capability/)

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`supports`](/reference/tevm/tx/interfaces/eip1559compatibletx/#supports)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:119

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`toCreationAddress`](/reference/tevm/tx/interfaces/eip1559compatibletx/#tocreationaddress)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:124

***

### toJSON()

> **toJSON**(): [`JsonTx`](/reference/tevm/tx/interfaces/jsontx/)

#### Returns

[`JsonTx`](/reference/tevm/tx/interfaces/jsontx/)

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`toJSON`](/reference/tevm/tx/interfaces/eip1559compatibletx/#tojson)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:138

***

### verifySignature()

> **verifySignature**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`verifySignature`](/reference/tevm/tx/interfaces/eip1559compatibletx/#verifysignature)

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:134
