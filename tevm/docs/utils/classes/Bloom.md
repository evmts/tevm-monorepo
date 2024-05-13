**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [utils](../README.md) > Bloom

# Class: Bloom

## Constructors

### new Bloom(bitvector)

> **new Bloom**(`bitvector`?): [`Bloom`](Bloom.md)

Represents a Bloom filter.

#### Parameters

▪ **bitvector?**: `Uint8Array`

#### Source

packages/utils/types/Bloom.d.ts:6

## Properties

### bitvector

> **bitvector**: `Uint8Array`

#### Source

packages/utils/types/Bloom.d.ts:2

## Methods

### add()

> **add**(`e`): `void`

Adds an element to a bit vector of a 64 byte bloom filter.

#### Parameters

▪ **e**: `Uint8Array`

The element to add

#### Source

packages/utils/types/Bloom.d.ts:11

***

### check()

> **check**(`e`): `boolean`

Checks if an element is in the bloom.

#### Parameters

▪ **e**: `Uint8Array`

The element to check

#### Source

packages/utils/types/Bloom.d.ts:16

***

### multiCheck()

> **multiCheck**(`topics`): `boolean`

Checks if multiple topics are in a bloom.

#### Parameters

▪ **topics**: `Uint8Array`[]

#### Returns

`true` if every topic is in the bloom

#### Source

packages/utils/types/Bloom.d.ts:21

***

### or()

> **or**(`bloom`): `void`

Bitwise or blooms together.

#### Parameters

▪ **bloom**: [`Bloom`](Bloom.md)

#### Source

packages/utils/types/Bloom.d.ts:25

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
