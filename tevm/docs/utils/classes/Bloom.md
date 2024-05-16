[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [utils](../README.md) / Bloom

# Class: Bloom

## Constructors

### new Bloom()

> **new Bloom**(`bitvector`?): [`Bloom`](Bloom.md)

Represents a Bloom filter.

#### Parameters

• **bitvector?**: `Uint8Array`

#### Returns

[`Bloom`](Bloom.md)

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

• **e**: `Uint8Array`

The element to add

#### Returns

`void`

#### Source

packages/utils/types/Bloom.d.ts:11

***

### check()

> **check**(`e`): `boolean`

Checks if an element is in the bloom.

#### Parameters

• **e**: `Uint8Array`

The element to check

#### Returns

`boolean`

#### Source

packages/utils/types/Bloom.d.ts:16

***

### multiCheck()

> **multiCheck**(`topics`): `boolean`

Checks if multiple topics are in a bloom.

#### Parameters

• **topics**: `Uint8Array`[]

#### Returns

`boolean`

`true` if every topic is in the bloom

#### Source

packages/utils/types/Bloom.d.ts:21

***

### or()

> **or**(`bloom`): `void`

Bitwise or blooms together.

#### Parameters

• **bloom**: [`Bloom`](Bloom.md)

#### Returns

`void`

#### Source

packages/utils/types/Bloom.d.ts:25
