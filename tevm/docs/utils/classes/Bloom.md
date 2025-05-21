[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / Bloom

# Class: Bloom

Defined in: packages/utils/types/Bloom.d.ts:4

A simple Bloom filter implementation originally from ethereumjs

## Constructors

### Constructor

> **new Bloom**(`bitvector?`): `Bloom`

Defined in: packages/utils/types/Bloom.d.ts:10

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

Defined in: packages/utils/types/Bloom.d.ts:5

## Methods

### add()

> **add**(`e`): `void`

Defined in: packages/utils/types/Bloom.d.ts:16

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

Defined in: packages/utils/types/Bloom.d.ts:22

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

Defined in: packages/utils/types/Bloom.d.ts:28

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

Defined in: packages/utils/types/Bloom.d.ts:33

Bitwise or blooms together.

#### Parameters

##### bloom

`Bloom`

#### Returns

`void`

#### Throws
