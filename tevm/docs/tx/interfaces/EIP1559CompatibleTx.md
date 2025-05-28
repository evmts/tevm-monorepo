[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [tx](../README.md) / EIP1559CompatibleTx

# Interface: EIP1559CompatibleTx\<T\>

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:165

## Extends

- `EIP2930CompatibleTx`\<`T`\>

## Extended by

- [`EIP4844CompatibleTx`](EIP4844CompatibleTx.md)

## Type Parameters

### T

`T` *extends* [`TransactionType`](../type-aliases/TransactionType.md) = [`TransactionType`](../type-aliases/TransactionType.md)

## Properties

### accessList

> `readonly` **accessList**: `AccessListBytes`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:163

#### Inherited from

`EIP2930CompatibleTx.accessList`

***

### cache

> `readonly` **cache**: `TransactionCache`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:131

#### Inherited from

`EIP2930CompatibleTx.cache`

***

### chainId

> `readonly` **chainId**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:159

#### Inherited from

`EIP2930CompatibleTx.chainId`

***

### common

> `readonly` **common**: `Common`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:122

#### Inherited from

`EIP2930CompatibleTx.common`

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:127

#### Inherited from

`EIP2930CompatibleTx.data`

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:124

#### Inherited from

`EIP2930CompatibleTx.gasLimit`

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:167

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:166

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:123

#### Inherited from

`EIP2930CompatibleTx.nonce`

***

### r?

> `readonly` `optional` **r**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:129

#### Inherited from

`EIP2930CompatibleTx.r`

***

### s?

> `readonly` `optional` **s**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:130

#### Inherited from

`EIP2930CompatibleTx.s`

***

### to?

> `readonly` `optional` **to**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:125

#### Inherited from

`EIP2930CompatibleTx.to`

***

### txOptions

> **txOptions**: [`TxOptions`](TxOptions.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:134

#### Inherited from

`EIP2930CompatibleTx.txOptions`

***

### type

> **type**: [`TransactionType`](../type-aliases/TransactionType.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:133

#### Inherited from

`EIP2930CompatibleTx.type`

***

### v?

> `readonly` `optional` **v**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:128

#### Inherited from

`EIP2930CompatibleTx.v`

***

### value

> `readonly` **value**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:126

#### Inherited from

`EIP2930CompatibleTx.value`

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

`EIP2930CompatibleTx.addSignature`

***

### errorStr()

> **errorStr**(): `string`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:153

#### Returns

`string`

#### Inherited from

`EIP2930CompatibleTx.errorStr`

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:136

#### Returns

`bigint`

#### Inherited from

`EIP2930CompatibleTx.getDataGas`

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:142

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.getHashedMessageToSign`

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:135

#### Returns

`bigint`

#### Inherited from

`EIP2930CompatibleTx.getIntrinsicGas`

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:160

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.getMessageToSign`

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:144

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.getMessageToVerifySignature`

***

### getSenderAddress()

> **getSenderAddress**(): [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:149

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Inherited from

`EIP2930CompatibleTx.getSenderAddress`

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:150

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.getSenderPublicKey`

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:137

#### Returns

`bigint`

#### Inherited from

`EIP2930CompatibleTx.getUpfrontCost`

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:145

#### Returns

`string`[]

#### Inherited from

`EIP2930CompatibleTx.getValidationErrors`

***

### hash()

> **hash**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:143

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.hash`

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:146

#### Returns

`boolean`

#### Inherited from

`EIP2930CompatibleTx.isSigned`

***

### isValid()

> **isValid**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:147

#### Returns

`boolean`

#### Inherited from

`EIP2930CompatibleTx.isValid`

***

### raw()

> **raw**(): `TxValuesArray`\[`T`\]

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:139

#### Returns

`TxValuesArray`\[`T`\]

#### Inherited from

`EIP2930CompatibleTx.raw`

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:140

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.serialize`

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

`EIP2930CompatibleTx.sign`

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

`EIP2930CompatibleTx.supports`

***

### toCreationAddress()

> **toCreationAddress**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:138

#### Returns

`boolean`

#### Inherited from

`EIP2930CompatibleTx.toCreationAddress`

***

### toJSON()

> **toJSON**(): [`JsonTx`](JsonTx.md)

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:152

#### Returns

[`JsonTx`](JsonTx.md)

#### Inherited from

`EIP2930CompatibleTx.toJSON`

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: node\_modules/.pnpm/@ethereumjs+tx@10.0.0/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:148

#### Returns

`boolean`

#### Inherited from

`EIP2930CompatibleTx.verifySignature`
