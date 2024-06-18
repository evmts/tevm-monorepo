---
editUrl: false
next: false
prev: false
title: "EIP1559CompatibleTx"
---

## Extends

- `EIP2930CompatibleTx`\<`T`\>

## Extended by

- [`EIP4844CompatibleTx`](/reference/tevm/tx/interfaces/eip4844compatibletx/)

## Type parameters

• **T** *extends* [`TransactionType`](/reference/tevm/tx/enumerations/transactiontype/) = [`TransactionType`](/reference/tevm/tx/enumerations/transactiontype/)

## Properties

### AccessListJSON

> `readonly` **AccessListJSON**: [`AccessList`](/reference/tevm/tx/type-aliases/accesslist/)

#### Inherited from

`EIP2930CompatibleTx.AccessListJSON`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:138

***

### accessList

> `readonly` **accessList**: `AccessListBytes`

#### Inherited from

`EIP2930CompatibleTx.accessList`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:137

***

### cache

> `readonly` **cache**: `TransactionCache`

#### Inherited from

`EIP2930CompatibleTx.cache`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:107

***

### chainId

> `readonly` **chainId**: `bigint`

#### Inherited from

`EIP2930CompatibleTx.chainId`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:133

***

### common

> `readonly` **common**: `Common`

#### Inherited from

`EIP2930CompatibleTx.common`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:98

***

### data

> `readonly` **data**: `Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.data`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:103

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

#### Inherited from

`EIP2930CompatibleTx.gasLimit`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:100

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:142

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:141

***

### nonce

> `readonly` **nonce**: `bigint`

#### Inherited from

`EIP2930CompatibleTx.nonce`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:99

***

### r?

> `optional` `readonly` **r**: `bigint`

#### Inherited from

`EIP2930CompatibleTx.r`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:105

***

### s?

> `optional` `readonly` **s**: `bigint`

#### Inherited from

`EIP2930CompatibleTx.s`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:106

***

### to?

> `optional` `readonly` **to**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

`EIP2930CompatibleTx.to`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:101

***

### type

> **type**: [`TransactionType`](/reference/tevm/tx/enumerations/transactiontype/)

#### Inherited from

`EIP2930CompatibleTx.type`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:109

***

### v?

> `optional` `readonly` **v**: `bigint`

#### Inherited from

`EIP2930CompatibleTx.v`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:104

***

### value

> `readonly` **value**: `bigint`

#### Inherited from

`EIP2930CompatibleTx.value`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:102

## Methods

### errorStr()

> **errorStr**(): `string`

#### Returns

`string`

#### Inherited from

`EIP2930CompatibleTx.errorStr`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:128

***

### getBaseFee()

> **getBaseFee**(): `bigint`

#### Returns

`bigint`

#### Inherited from

`EIP2930CompatibleTx.getBaseFee`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:110

***

### getDataFee()

> **getDataFee**(): `bigint`

#### Returns

`bigint`

#### Inherited from

`EIP2930CompatibleTx.getDataFee`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:111

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.getHashedMessageToSign`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:117

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.getMessageToSign`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:134

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.getMessageToVerifySignature`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:119

***

### getSenderAddress()

> **getSenderAddress**(): [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Returns

[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

`EIP2930CompatibleTx.getSenderAddress`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:124

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.getSenderPublicKey`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:125

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

#### Returns

`bigint`

#### Inherited from

`EIP2930CompatibleTx.getUpfrontCost`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:112

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

#### Returns

`string`[]

#### Inherited from

`EIP2930CompatibleTx.getValidationErrors`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:120

***

### hash()

> **hash**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.hash`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:118

***

### isSigned()

> **isSigned**(): `boolean`

#### Returns

`boolean`

#### Inherited from

`EIP2930CompatibleTx.isSigned`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:121

***

### isValid()

> **isValid**(): `boolean`

#### Returns

`boolean`

#### Inherited from

`EIP2930CompatibleTx.isValid`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:122

***

### raw()

> **raw**(): `TxValuesArray`\[`T`\]

#### Returns

`TxValuesArray`\[`T`\]

#### Inherited from

`EIP2930CompatibleTx.raw`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:114

***

### serialize()

> **serialize**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.serialize`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:115

***

### sign()

> **sign**(`privateKey`): `Transaction`\[`T`\]

#### Parameters

• **privateKey**: `Uint8Array`

#### Returns

`Transaction`\[`T`\]

#### Inherited from

`EIP2930CompatibleTx.sign`

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

`EIP2930CompatibleTx.supports`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:108

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

#### Returns

`boolean`

#### Inherited from

`EIP2930CompatibleTx.toCreationAddress`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:113

***

### toJSON()

> **toJSON**(): [`JsonTx`](/reference/tevm/tx/interfaces/jsontx/)

#### Returns

[`JsonTx`](/reference/tevm/tx/interfaces/jsontx/)

#### Inherited from

`EIP2930CompatibleTx.toJSON`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:127

***

### verifySignature()

> **verifySignature**(): `boolean`

#### Returns

`boolean`

#### Inherited from

`EIP2930CompatibleTx.verifySignature`

#### Source

node\_modules/.pnpm/@ethereumjs+tx@5.3.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:123
