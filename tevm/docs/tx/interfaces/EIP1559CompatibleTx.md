[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [tx](../README.md) / EIP1559CompatibleTx

# Interface: EIP1559CompatibleTx\<T\>

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:151

## Extends

- `EIP2930CompatibleTx`\<`T`\>

## Extended by

- [`EIP4844CompatibleTx`](EIP4844CompatibleTx.md)

## Type Parameters

### T

`T` *extends* [`TransactionType`](../enumerations/TransactionType.md) = [`TransactionType`](../enumerations/TransactionType.md)

## Properties

### accessList

> `readonly` **accessList**: `AccessListBytes`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:148

#### Inherited from

`EIP2930CompatibleTx.accessList`

***

### AccessListJSON

> `readonly` **AccessListJSON**: [`AccessList`](../type-aliases/AccessList.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:149

#### Inherited from

`EIP2930CompatibleTx.AccessListJSON`

***

### cache

> `readonly` **cache**: `TransactionCache`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:118

#### Inherited from

`EIP2930CompatibleTx.cache`

***

### chainId

> `readonly` **chainId**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:144

#### Inherited from

`EIP2930CompatibleTx.chainId`

***

### common

> `readonly` **common**: `Common`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:109

#### Inherited from

`EIP2930CompatibleTx.common`

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:114

#### Inherited from

`EIP2930CompatibleTx.data`

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:111

#### Inherited from

`EIP2930CompatibleTx.gasLimit`

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:153

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:152

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:110

#### Inherited from

`EIP2930CompatibleTx.nonce`

***

### r?

> `readonly` `optional` **r**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:116

#### Inherited from

`EIP2930CompatibleTx.r`

***

### s?

> `readonly` `optional` **s**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:117

#### Inherited from

`EIP2930CompatibleTx.s`

***

### to?

> `readonly` `optional` **to**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:112

#### Inherited from

`EIP2930CompatibleTx.to`

***

### type

> **type**: [`TransactionType`](../enumerations/TransactionType.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:120

#### Inherited from

`EIP2930CompatibleTx.type`

***

### v?

> `readonly` `optional` **v**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:115

#### Inherited from

`EIP2930CompatibleTx.v`

***

### value

> `readonly` **value**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:113

#### Inherited from

`EIP2930CompatibleTx.value`

## Methods

### errorStr()

> **errorStr**(): `string`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:139

#### Returns

`string`

#### Inherited from

`EIP2930CompatibleTx.errorStr`

***

### getBaseFee()

> **getBaseFee**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:121

#### Returns

`bigint`

#### Inherited from

`EIP2930CompatibleTx.getBaseFee`

***

### getDataFee()

> **getDataFee**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:122

#### Returns

`bigint`

#### Inherited from

`EIP2930CompatibleTx.getDataFee`

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:128

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.getHashedMessageToSign`

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:145

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.getMessageToSign`

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:130

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.getMessageToVerifySignature`

***

### getSenderAddress()

> **getSenderAddress**(): [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:135

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Inherited from

`EIP2930CompatibleTx.getSenderAddress`

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:136

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.getSenderPublicKey`

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:123

#### Returns

`bigint`

#### Inherited from

`EIP2930CompatibleTx.getUpfrontCost`

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:131

#### Returns

`string`[]

#### Inherited from

`EIP2930CompatibleTx.getValidationErrors`

***

### hash()

> **hash**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:129

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.hash`

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:132

#### Returns

`boolean`

#### Inherited from

`EIP2930CompatibleTx.isSigned`

***

### isValid()

> **isValid**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:133

#### Returns

`boolean`

#### Inherited from

`EIP2930CompatibleTx.isValid`

***

### raw()

> **raw**(): `TxValuesArray`\[`T`\]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:125

#### Returns

`TxValuesArray`\[`T`\]

#### Inherited from

`EIP2930CompatibleTx.raw`

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:126

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.serialize`

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

`EIP2930CompatibleTx.sign`

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

`EIP2930CompatibleTx.supports`

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:124

#### Returns

`boolean`

#### Inherited from

`EIP2930CompatibleTx.toCreationAddress`

***

### toJSON()

> **toJSON**(): [`JsonTx`](JsonTx.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:138

#### Returns

[`JsonTx`](JsonTx.md)

#### Inherited from

`EIP2930CompatibleTx.toJSON`

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@5.4.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:134

#### Returns

`boolean`

#### Inherited from

`EIP2930CompatibleTx.verifySignature`
