[@tevm/tx](../README.md) / [Exports](../modules.md) / EIP1559CompatibleTx

# Interface: EIP1559CompatibleTx\<T\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `TransactionType` = `TransactionType` |

## Hierarchy

- `EIP2930CompatibleTx`\<`T`\>

  ↳ **`EIP1559CompatibleTx`**

## Table of contents

### Properties

- [AccessListJSON](EIP1559CompatibleTx.md#accesslistjson)
- [accessList](EIP1559CompatibleTx.md#accesslist)
- [cache](EIP1559CompatibleTx.md#cache)
- [chainId](EIP1559CompatibleTx.md#chainid)
- [common](EIP1559CompatibleTx.md#common)
- [data](EIP1559CompatibleTx.md#data)
- [gasLimit](EIP1559CompatibleTx.md#gaslimit)
- [maxFeePerGas](EIP1559CompatibleTx.md#maxfeepergas)
- [maxPriorityFeePerGas](EIP1559CompatibleTx.md#maxpriorityfeepergas)
- [nonce](EIP1559CompatibleTx.md#nonce)
- [r](EIP1559CompatibleTx.md#r)
- [s](EIP1559CompatibleTx.md#s)
- [to](EIP1559CompatibleTx.md#to)
- [type](EIP1559CompatibleTx.md#type)
- [v](EIP1559CompatibleTx.md#v)
- [value](EIP1559CompatibleTx.md#value)

### Methods

- [errorStr](EIP1559CompatibleTx.md#errorstr)
- [getBaseFee](EIP1559CompatibleTx.md#getbasefee)
- [getDataFee](EIP1559CompatibleTx.md#getdatafee)
- [getHashedMessageToSign](EIP1559CompatibleTx.md#gethashedmessagetosign)
- [getMessageToSign](EIP1559CompatibleTx.md#getmessagetosign)
- [getMessageToVerifySignature](EIP1559CompatibleTx.md#getmessagetoverifysignature)
- [getSenderAddress](EIP1559CompatibleTx.md#getsenderaddress)
- [getSenderPublicKey](EIP1559CompatibleTx.md#getsenderpublickey)
- [getUpfrontCost](EIP1559CompatibleTx.md#getupfrontcost)
- [getValidationErrors](EIP1559CompatibleTx.md#getvalidationerrors)
- [hash](EIP1559CompatibleTx.md#hash)
- [isSigned](EIP1559CompatibleTx.md#issigned)
- [isValid](EIP1559CompatibleTx.md#isvalid)
- [raw](EIP1559CompatibleTx.md#raw)
- [serialize](EIP1559CompatibleTx.md#serialize)
- [sign](EIP1559CompatibleTx.md#sign)
- [supports](EIP1559CompatibleTx.md#supports)
- [toCreationAddress](EIP1559CompatibleTx.md#tocreationaddress)
- [toJSON](EIP1559CompatibleTx.md#tojson)
- [verifySignature](EIP1559CompatibleTx.md#verifysignature)

## Properties

### AccessListJSON

• `Readonly` **AccessListJSON**: `AccessList`

#### Inherited from

EIP2930CompatibleTx.AccessListJSON

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:138

___

### accessList

• `Readonly` **accessList**: `AccessListBytes`

#### Inherited from

EIP2930CompatibleTx.accessList

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:137

___

### cache

• `Readonly` **cache**: `TransactionCache`

#### Inherited from

EIP2930CompatibleTx.cache

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:107

___

### chainId

• `Readonly` **chainId**: `bigint`

#### Inherited from

EIP2930CompatibleTx.chainId

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:133

___

### common

• `Readonly` **common**: `Common`

#### Inherited from

EIP2930CompatibleTx.common

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:98

___

### data

• `Readonly` **data**: `Uint8Array`

#### Inherited from

EIP2930CompatibleTx.data

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:103

___

### gasLimit

• `Readonly` **gasLimit**: `bigint`

#### Inherited from

EIP2930CompatibleTx.gasLimit

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:100

___

### maxFeePerGas

• `Readonly` **maxFeePerGas**: `bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:142

___

### maxPriorityFeePerGas

• `Readonly` **maxPriorityFeePerGas**: `bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:141

___

### nonce

• `Readonly` **nonce**: `bigint`

#### Inherited from

EIP2930CompatibleTx.nonce

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:99

___

### r

• `Optional` `Readonly` **r**: `bigint`

#### Inherited from

EIP2930CompatibleTx.r

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:105

___

### s

• `Optional` `Readonly` **s**: `bigint`

#### Inherited from

EIP2930CompatibleTx.s

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:106

___

### to

• `Optional` `Readonly` **to**: `Address`

#### Inherited from

EIP2930CompatibleTx.to

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:101

___

### type

• **type**: `TransactionType`

#### Inherited from

EIP2930CompatibleTx.type

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:109

___

### v

• `Optional` `Readonly` **v**: `bigint`

#### Inherited from

EIP2930CompatibleTx.v

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:104

___

### value

• `Readonly` **value**: `bigint`

#### Inherited from

EIP2930CompatibleTx.value

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:102

## Methods

### errorStr

▸ **errorStr**(): `string`

#### Returns

`string`

#### Inherited from

EIP2930CompatibleTx.errorStr

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:128

___

### getBaseFee

▸ **getBaseFee**(): `bigint`

#### Returns

`bigint`

#### Inherited from

EIP2930CompatibleTx.getBaseFee

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:110

___

### getDataFee

▸ **getDataFee**(): `bigint`

#### Returns

`bigint`

#### Inherited from

EIP2930CompatibleTx.getDataFee

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:111

___

### getHashedMessageToSign

▸ **getHashedMessageToSign**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

EIP2930CompatibleTx.getHashedMessageToSign

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:117

___

### getMessageToSign

▸ **getMessageToSign**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

EIP2930CompatibleTx.getMessageToSign

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:134

___

### getMessageToVerifySignature

▸ **getMessageToVerifySignature**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

EIP2930CompatibleTx.getMessageToVerifySignature

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:119

___

### getSenderAddress

▸ **getSenderAddress**(): `Address`

#### Returns

`Address`

#### Inherited from

EIP2930CompatibleTx.getSenderAddress

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:124

___

### getSenderPublicKey

▸ **getSenderPublicKey**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

EIP2930CompatibleTx.getSenderPublicKey

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:125

___

### getUpfrontCost

▸ **getUpfrontCost**(): `bigint`

#### Returns

`bigint`

#### Inherited from

EIP2930CompatibleTx.getUpfrontCost

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:112

___

### getValidationErrors

▸ **getValidationErrors**(): `string`[]

#### Returns

`string`[]

#### Inherited from

EIP2930CompatibleTx.getValidationErrors

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:120

___

### hash

▸ **hash**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

EIP2930CompatibleTx.hash

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:118

___

### isSigned

▸ **isSigned**(): `boolean`

#### Returns

`boolean`

#### Inherited from

EIP2930CompatibleTx.isSigned

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:121

___

### isValid

▸ **isValid**(): `boolean`

#### Returns

`boolean`

#### Inherited from

EIP2930CompatibleTx.isValid

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:122

___

### raw

▸ **raw**(): `TxValuesArray`[`T`]

#### Returns

`TxValuesArray`[`T`]

#### Inherited from

EIP2930CompatibleTx.raw

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:114

___

### serialize

▸ **serialize**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

EIP2930CompatibleTx.serialize

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:115

___

### sign

▸ **sign**(`privateKey`): `Transaction`[`T`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `privateKey` | `Uint8Array` |

#### Returns

`Transaction`[`T`]

#### Inherited from

EIP2930CompatibleTx.sign

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:126

___

### supports

▸ **supports**(`capability`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `capability` | [`Capability`](../enums/Capability.md) |

#### Returns

`boolean`

#### Inherited from

EIP2930CompatibleTx.supports

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:108

___

### toCreationAddress

▸ **toCreationAddress**(): `boolean`

#### Returns

`boolean`

#### Inherited from

EIP2930CompatibleTx.toCreationAddress

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:113

___

### toJSON

▸ **toJSON**(): `JsonTx`

#### Returns

`JsonTx`

#### Inherited from

EIP2930CompatibleTx.toJSON

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:127

___

### verifySignature

▸ **verifySignature**(): `boolean`

#### Returns

`boolean`

#### Inherited from

EIP2930CompatibleTx.verifySignature

#### Defined in

node_modules/.pnpm/@ethereumjs+tx@5.3.0/node_modules/@ethereumjs/tx/dist/esm/types.d.ts:123
