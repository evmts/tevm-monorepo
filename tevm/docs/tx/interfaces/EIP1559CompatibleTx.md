[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [tx](../README.md) / EIP1559CompatibleTx

# Interface: EIP1559CompatibleTx\<T\>

## Extends

- `EIP2930CompatibleTx`\<`T`\>

## Extended by

- [`EIP4844CompatibleTx`](EIP4844CompatibleTx.md)

## Type Parameters

• **T** *extends* [`TransactionType`](../enumerations/TransactionType.md) = [`TransactionType`](../enumerations/TransactionType.md)

## Properties

### AccessListJSON

> `readonly` **AccessListJSON**: [`AccessList`](../type-aliases/AccessList.md)

#### Inherited from

`EIP2930CompatibleTx.AccessListJSON`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:149

***

### accessList

> `readonly` **accessList**: `AccessListBytes`

#### Inherited from

`EIP2930CompatibleTx.accessList`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:148

***

### cache

> `readonly` **cache**: `TransactionCache`

#### Inherited from

`EIP2930CompatibleTx.cache`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:118

***

### chainId

> `readonly` **chainId**: `bigint`

#### Inherited from

`EIP2930CompatibleTx.chainId`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:144

***

### common

> `readonly` **common**: `Common`

#### Inherited from

`EIP2930CompatibleTx.common`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:109

***

### data

> `readonly` **data**: `Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.data`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:114

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

#### Inherited from

`EIP2930CompatibleTx.gasLimit`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:111

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:153

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:152

***

### nonce

> `readonly` **nonce**: `bigint`

#### Inherited from

`EIP2930CompatibleTx.nonce`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:110

***

### r?

> `readonly` `optional` **r**: `bigint`

#### Inherited from

`EIP2930CompatibleTx.r`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:116

***

### s?

> `readonly` `optional` **s**: `bigint`

#### Inherited from

`EIP2930CompatibleTx.s`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:117

***

### to?

> `readonly` `optional` **to**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Inherited from

`EIP2930CompatibleTx.to`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:112

***

### type

> **type**: [`TransactionType`](../enumerations/TransactionType.md)

#### Inherited from

`EIP2930CompatibleTx.type`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:120

***

### v?

> `readonly` `optional` **v**: `bigint`

#### Inherited from

`EIP2930CompatibleTx.v`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:115

***

### value

> `readonly` **value**: `bigint`

#### Inherited from

`EIP2930CompatibleTx.value`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:113

## Methods

### errorStr()

> **errorStr**(): `string`

#### Returns

`string`

#### Inherited from

`EIP2930CompatibleTx.errorStr`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:139

***

### getBaseFee()

> **getBaseFee**(): `bigint`

#### Returns

`bigint`

#### Inherited from

`EIP2930CompatibleTx.getBaseFee`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:121

***

### getDataFee()

> **getDataFee**(): `bigint`

#### Returns

`bigint`

#### Inherited from

`EIP2930CompatibleTx.getDataFee`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:122

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.getHashedMessageToSign`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:128

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.getMessageToSign`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:145

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.getMessageToVerifySignature`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:130

***

### getSenderAddress()

> **getSenderAddress**(): [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Inherited from

`EIP2930CompatibleTx.getSenderAddress`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:135

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.getSenderPublicKey`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:136

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

#### Returns

`bigint`

#### Inherited from

`EIP2930CompatibleTx.getUpfrontCost`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:123

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

#### Returns

`string`[]

#### Inherited from

`EIP2930CompatibleTx.getValidationErrors`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:131

***

### hash()

> **hash**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.hash`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:129

***

### isSigned()

> **isSigned**(): `boolean`

#### Returns

`boolean`

#### Inherited from

`EIP2930CompatibleTx.isSigned`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:132

***

### isValid()

> **isValid**(): `boolean`

#### Returns

`boolean`

#### Inherited from

`EIP2930CompatibleTx.isValid`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:133

***

### raw()

> **raw**(): `TxValuesArray`\[`T`\]

#### Returns

`TxValuesArray`\[`T`\]

#### Inherited from

`EIP2930CompatibleTx.raw`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:125

***

### serialize()

> **serialize**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.serialize`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:126

***

### sign()

> **sign**(`privateKey`): `Transaction`\[`T`\]

#### Parameters

• **privateKey**: `Uint8Array`

#### Returns

`Transaction`\[`T`\]

#### Inherited from

`EIP2930CompatibleTx.sign`

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

`EIP2930CompatibleTx.supports`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:119

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

#### Returns

`boolean`

#### Inherited from

`EIP2930CompatibleTx.toCreationAddress`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:124

***

### toJSON()

> **toJSON**(): [`JsonTx`](JsonTx.md)

#### Returns

[`JsonTx`](JsonTx.md)

#### Inherited from

`EIP2930CompatibleTx.toJSON`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:138

***

### verifySignature()

> **verifySignature**(): `boolean`

#### Returns

`boolean`

#### Inherited from

`EIP2930CompatibleTx.verifySignature`

#### Defined in

node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:134
