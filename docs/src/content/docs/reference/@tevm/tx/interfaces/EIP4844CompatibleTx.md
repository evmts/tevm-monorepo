---
editUrl: false
next: false
prev: false
title: "EIP4844CompatibleTx"
---

## Extends

- [`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/)\<`T`\>

## Type parameters

• **T** *extends* [`TransactionType`](/reference/tevm/tx/enumerations/transactiontype/) = [`TransactionType`](/reference/tevm/tx/enumerations/transactiontype/)

## Properties

### AccessListJSON

> `readonly` **AccessListJSON**: [`AccessList`](/reference/tevm/tx/type-aliases/accesslist/)

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`AccessListJSON`](/reference/tevm/tx/interfaces/eip1559compatibletx/#accesslistjson)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:138

***

### accessList

> `readonly` **accessList**: `AccessListBytes`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`accessList`](/reference/tevm/tx/interfaces/eip1559compatibletx/#accesslist)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:137

***

### blobVersionedHashes

> **blobVersionedHashes**: `Uint8Array`[]

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:146

***

### blobs?

> `optional` **blobs**: `Uint8Array`[]

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:147

***

### cache

> `readonly` **cache**: `TransactionCache`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`cache`](/reference/tevm/tx/interfaces/eip1559compatibletx/#cache)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:107

***

### chainId

> `readonly` **chainId**: `bigint`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`chainId`](/reference/tevm/tx/interfaces/eip1559compatibletx/#chainid)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:133

***

### common

> `readonly` **common**: `Common`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`common`](/reference/tevm/tx/interfaces/eip1559compatibletx/#common)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:98

***

### data

> `readonly` **data**: `Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`data`](/reference/tevm/tx/interfaces/eip1559compatibletx/#data)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:103

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`gasLimit`](/reference/tevm/tx/interfaces/eip1559compatibletx/#gaslimit)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:100

***

### kzgCommitments?

> `optional` **kzgCommitments**: `Uint8Array`[]

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:148

***

### kzgProofs?

> `optional` **kzgProofs**: `Uint8Array`[]

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:149

***

### maxFeePerBlobGas

> `readonly` **maxFeePerBlobGas**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:145

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`maxFeePerGas`](/reference/tevm/tx/interfaces/eip1559compatibletx/#maxfeepergas)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:142

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`maxPriorityFeePerGas`](/reference/tevm/tx/interfaces/eip1559compatibletx/#maxpriorityfeepergas)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:141

***

### nonce

> `readonly` **nonce**: `bigint`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`nonce`](/reference/tevm/tx/interfaces/eip1559compatibletx/#nonce)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:99

***

### r?

> `optional` `readonly` **r**: `bigint`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`r`](/reference/tevm/tx/interfaces/eip1559compatibletx/#r)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:105

***

### s?

> `optional` `readonly` **s**: `bigint`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`s`](/reference/tevm/tx/interfaces/eip1559compatibletx/#s)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:106

***

### to?

> `optional` `readonly` **to**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`to`](/reference/tevm/tx/interfaces/eip1559compatibletx/#to)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:101

***

### type

> **type**: [`TransactionType`](/reference/tevm/tx/enumerations/transactiontype/)

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`type`](/reference/tevm/tx/interfaces/eip1559compatibletx/#type)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:109

***

### v?

> `optional` `readonly` **v**: `bigint`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`v`](/reference/tevm/tx/interfaces/eip1559compatibletx/#v)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:104

***

### value

> `readonly` **value**: `bigint`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`value`](/reference/tevm/tx/interfaces/eip1559compatibletx/#value)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:102

## Methods

### errorStr()

> **errorStr**(): `string`

#### Returns

`string`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`errorStr`](/reference/tevm/tx/interfaces/eip1559compatibletx/#errorstr)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:128

***

### getBaseFee()

> **getBaseFee**(): `bigint`

#### Returns

`bigint`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`getBaseFee`](/reference/tevm/tx/interfaces/eip1559compatibletx/#getbasefee)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:110

***

### getDataFee()

> **getDataFee**(): `bigint`

#### Returns

`bigint`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`getDataFee`](/reference/tevm/tx/interfaces/eip1559compatibletx/#getdatafee)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:111

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`getHashedMessageToSign`](/reference/tevm/tx/interfaces/eip1559compatibletx/#gethashedmessagetosign)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:117

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`getMessageToSign`](/reference/tevm/tx/interfaces/eip1559compatibletx/#getmessagetosign)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:134

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`getMessageToVerifySignature`](/reference/tevm/tx/interfaces/eip1559compatibletx/#getmessagetoverifysignature)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:119

***

### getSenderAddress()

> **getSenderAddress**(): [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Returns

[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`getSenderAddress`](/reference/tevm/tx/interfaces/eip1559compatibletx/#getsenderaddress)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:124

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`getSenderPublicKey`](/reference/tevm/tx/interfaces/eip1559compatibletx/#getsenderpublickey)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:125

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

#### Returns

`bigint`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`getUpfrontCost`](/reference/tevm/tx/interfaces/eip1559compatibletx/#getupfrontcost)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:112

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

#### Returns

`string`[]

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`getValidationErrors`](/reference/tevm/tx/interfaces/eip1559compatibletx/#getvalidationerrors)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:120

***

### hash()

> **hash**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`hash`](/reference/tevm/tx/interfaces/eip1559compatibletx/#hash)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:118

***

### isSigned()

> **isSigned**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`isSigned`](/reference/tevm/tx/interfaces/eip1559compatibletx/#issigned)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:121

***

### isValid()

> **isValid**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`isValid`](/reference/tevm/tx/interfaces/eip1559compatibletx/#isvalid)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:122

***

### numBlobs()

> **numBlobs**(): `number`

#### Returns

`number`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:151

***

### raw()

> **raw**(): `TxValuesArray`\[`T`\]

#### Returns

`TxValuesArray`\[`T`\]

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`raw`](/reference/tevm/tx/interfaces/eip1559compatibletx/#raw)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:114

***

### serialize()

> **serialize**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`serialize`](/reference/tevm/tx/interfaces/eip1559compatibletx/#serialize)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:115

***

### serializeNetworkWrapper()

> **serializeNetworkWrapper**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:150

***

### sign()

> **sign**(`privateKey`): `Transaction`\[`T`\]

#### Parameters

• **privateKey**: `Uint8Array`

#### Returns

`Transaction`\[`T`\]

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`sign`](/reference/tevm/tx/interfaces/eip1559compatibletx/#sign)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:126

***

### supports()

> **supports**(`capability`): `boolean`

#### Parameters

• **capability**: [`Capability`](/reference/tevm/tx/enumerations/capability/)

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`supports`](/reference/tevm/tx/interfaces/eip1559compatibletx/#supports)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:108

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`toCreationAddress`](/reference/tevm/tx/interfaces/eip1559compatibletx/#tocreationaddress)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:113

***

### toJSON()

> **toJSON**(): [`JsonTx`](/reference/tevm/tx/interfaces/jsontx/)

#### Returns

[`JsonTx`](/reference/tevm/tx/interfaces/jsontx/)

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`toJSON`](/reference/tevm/tx/interfaces/eip1559compatibletx/#tojson)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:127

***

### verifySignature()

> **verifySignature**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[`EIP1559CompatibleTx`](/reference/tevm/tx/interfaces/eip1559compatibletx/).[`verifySignature`](/reference/tevm/tx/interfaces/eip1559compatibletx/#verifysignature)

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:123
