[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / Bloom

# Class: Bloom

Defined in: [packages/utils/src/Bloom.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L14)

A simple Bloom filter implementation originally from ethereumjs

## Constructors

### new Bloom()

> **new Bloom**(`bitvector`?): `Bloom`

Defined in: [packages/utils/src/Bloom.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L21)

Represents a Bloom filter.

#### Parameters

##### bitvector?

`Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`Bloom`

#### Throws

If the byte size of the bitvector is not 256.

## Properties

### bitvector

> **bitvector**: `Uint8Array`

Defined in: [packages/utils/src/Bloom.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L15)

## Methods

### add()

> **add**(`e`): `void`

Defined in: [packages/utils/src/Bloom.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L35)

Adds an element to a bit vector of a 64 byte bloom filter.

#### Parameters

##### e

`Uint8Array`

The element to add

#### Returns

`void`

#### Throws

***

### check()

> **check**(`e`): `boolean`

Defined in: [packages/utils/src/Bloom.ts:58](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L58)

Checks if an element is in the bloom.

#### Parameters

##### e

`Uint8Array`

The element to check

#### Returns

`boolean`

#### Throws

***

### multiCheck()

> **multiCheck**(`topics`): `boolean`

Defined in: [packages/utils/src/Bloom.ts:83](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L83)

Checks if multiple topics are in a bloom.

#### Parameters

##### topics

`Uint8Array`\<`ArrayBufferLike`\>[]

#### Returns

`boolean`

`true` if every topic is in the bloom

#### Throws

***

### or()

> **or**(`bloom`): `void`

Defined in: [packages/utils/src/Bloom.ts:91](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L91)

Bitwise or blooms together.

#### Parameters

##### bloom

`Bloom`

#### Returns

`void`

#### Throws
