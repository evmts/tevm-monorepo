[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / Bloom

# Class: Bloom

Defined in: zevm/npm/zevm/dist/receipt.d.ts:22

Ethereum logs bloom filter.

## Constructors

### Constructor

> **new Bloom**(`bitvector?`, `common?`): `Bloom`

Defined in: zevm/npm/zevm/dist/receipt.d.ts:25

#### Parameters

##### bitvector?

`Uint8Array`\<`ArrayBufferLike`\>

##### common?

`CommonLike`

#### Returns

`Bloom`

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Defined in: zevm/npm/zevm/dist/receipt.d.ts:24

## Methods

### add()

> **add**(`value`): `void`

Defined in: zevm/npm/zevm/dist/receipt.d.ts:26

#### Parameters

##### value

`Uint8Array`

#### Returns

`void`

***

### check()

> **check**(`value`): `boolean`

Defined in: zevm/npm/zevm/dist/receipt.d.ts:27

#### Parameters

##### value

`Uint8Array`

#### Returns

`boolean`

***

### multiCheck()

> **multiCheck**(`values`): `boolean`

Defined in: zevm/npm/zevm/dist/receipt.d.ts:28

#### Parameters

##### values

`Uint8Array`\<`ArrayBufferLike`\>[]

#### Returns

`boolean`

***

### or()

> **or**(`bloom`): `void`

Defined in: zevm/npm/zevm/dist/receipt.d.ts:29

#### Parameters

##### bloom

`Bloom`

#### Returns

`void`
