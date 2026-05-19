[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [tx](../README.md) / EIP1559CompatibleTx

# Interface: EIP1559CompatibleTx\<T\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:200

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

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:198

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`accessList`](EIP4844CompatibleTx.md#accesslist)

***

### cache

> `readonly` **cache**: `TransactionCache`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:166

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`cache`](EIP4844CompatibleTx.md#cache)

***

### chainId

> `readonly` **chainId**: `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:194

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`chainId`](EIP4844CompatibleTx.md#chainid)

***

### common

> `readonly` **common**: `Common`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:157

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`common`](EIP4844CompatibleTx.md#common)

***

### data

> `readonly` **data**: `Uint8Array`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:162

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`data`](EIP4844CompatibleTx.md#data)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:159

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`gasLimit`](EIP4844CompatibleTx.md#gaslimit)

***

### maxFeePerGas

> `readonly` **maxFeePerGas**: `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:202

***

### maxPriorityFeePerGas

> `readonly` **maxPriorityFeePerGas**: `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:201

***

### nonce

> `readonly` **nonce**: `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:158

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`nonce`](EIP4844CompatibleTx.md#nonce)

***

### r?

> `readonly` `optional` **r?**: `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:164

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`r`](EIP4844CompatibleTx.md#r)

***

### s?

> `readonly` `optional` **s?**: `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:165

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`s`](EIP4844CompatibleTx.md#s)

***

### to?

> `readonly` `optional` **to?**: `Address`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:160

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`to`](EIP4844CompatibleTx.md#to)

***

### txOptions

> **txOptions**: [`TxOptions`](TxOptions.md)

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:169

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`txOptions`](EIP4844CompatibleTx.md#txoptions)

***

### type

> **type**: [`TransactionType`](../type-aliases/TransactionType.md)

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:168

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`type`](EIP4844CompatibleTx.md#type)

***

### v?

> `readonly` `optional` **v?**: `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:163

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`v`](EIP4844CompatibleTx.md#v)

***

### value

> `readonly` **value**: `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:161

#### Inherited from

[`EIP4844CompatibleTx`](EIP4844CompatibleTx.md).[`value`](EIP4844CompatibleTx.md#value)

## Methods

### addSignature()

> **addSignature**(`v`, `r`, `s`, `convertV?`): `Transaction`\[`T`\]

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:189

#### Parameters

##### v

`bigint`

##### r

`bigint` \| `Uint8Array`\<`ArrayBufferLike`\>

##### s

`bigint` \| `Uint8Array`\<`ArrayBufferLike`\>

##### convertV?

`boolean`

#### Returns

`Transaction`\[`T`\]

#### Inherited from

`EIP2930CompatibleTx.addSignature`

***

### errorStr()

> **errorStr**(): `string`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:188

#### Returns

`string`

#### Inherited from

`EIP2930CompatibleTx.errorStr`

***

### getDataGas()

> **getDataGas**(): `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:171

#### Returns

`bigint`

#### Inherited from

`EIP2930CompatibleTx.getDataGas`

***

### getHashedMessageToSign()

> **getHashedMessageToSign**(): `Uint8Array`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:177

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.getHashedMessageToSign`

***

### getIntrinsicGas()

> **getIntrinsicGas**(): `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:170

#### Returns

`bigint`

#### Inherited from

`EIP2930CompatibleTx.getIntrinsicGas`

***

### getMessageToSign()

> **getMessageToSign**(): `Uint8Array`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:195

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.getMessageToSign`

***

### getMessageToVerifySignature()

> **getMessageToVerifySignature**(): `Uint8Array`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:179

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.getMessageToVerifySignature`

***

### getSenderAddress()

> **getSenderAddress**(): `Address`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:184

#### Returns

`Address`

#### Inherited from

`EIP2930CompatibleTx.getSenderAddress`

***

### getSenderPublicKey()

> **getSenderPublicKey**(): `Uint8Array`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:185

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.getSenderPublicKey`

***

### getUpfrontCost()

> **getUpfrontCost**(): `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:172

#### Returns

`bigint`

#### Inherited from

`EIP2930CompatibleTx.getUpfrontCost`

***

### getValidationErrors()

> **getValidationErrors**(): `string`[]

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:180

#### Returns

`string`[]

#### Inherited from

`EIP2930CompatibleTx.getValidationErrors`

***

### hash()

> **hash**(): `Uint8Array`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:178

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.hash`

***

### isSigned()

> **isSigned**(): `boolean`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:181

#### Returns

`boolean`

#### Inherited from

`EIP2930CompatibleTx.isSigned`

***

### isValid()

> **isValid**(): `boolean`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:182

#### Returns

`boolean`

#### Inherited from

`EIP2930CompatibleTx.isValid`

***

### raw()

> **raw**(): `TxValuesArray`\[`T`\]

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:174

#### Returns

`TxValuesArray`\[`T`\]

#### Inherited from

`EIP2930CompatibleTx.raw`

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:175

#### Returns

`Uint8Array`

#### Inherited from

`EIP2930CompatibleTx.serialize`

***

### sign()

> **sign**(`privateKey`, `extraEntropy?`): `Transaction`\[`T`\]

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:186

#### Parameters

##### privateKey

`Uint8Array`

##### extraEntropy?

`boolean` \| `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`Transaction`\[`T`\]

#### Inherited from

`EIP2930CompatibleTx.sign`

***

### supports()

> **supports**(`capability`): `boolean`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:167

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

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:173

#### Returns

`boolean`

#### Inherited from

`EIP2930CompatibleTx.toCreationAddress`

***

### toJSON()

> **toJSON**(): [`JsonTx`](JsonTx.md)

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:187

#### Returns

[`JsonTx`](JsonTx.md)

#### Inherited from

`EIP2930CompatibleTx.toJSON`

***

### verifySignature()

> **verifySignature**(): `boolean`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+tx@10.1.1/node\_modules/@ethereumjs/tx/dist/esm/types.d.ts:183

#### Returns

`boolean`

#### Inherited from

`EIP2930CompatibleTx.verifySignature`
