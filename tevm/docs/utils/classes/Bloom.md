[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [utils](../README.md) / Bloom

# Class: Bloom

A simple Bloom filter implementation originally from ethereumjs

## Constructors

### new Bloom()

> **new Bloom**(`bitvector`?): [`Bloom`](Bloom.md)

Represents a Bloom filter.

#### Parameters

• **bitvector?**: `Uint8Array`

#### Returns

[`Bloom`](Bloom.md)

#### Throws

If the byte size of the bitvector is not 256.

#### Defined in

packages/utils/types/Bloom.d.ts:10

## Properties

### bitvector

> **bitvector**: `Uint8Array`

#### Defined in

packages/utils/types/Bloom.d.ts:5

## Methods

### add()

> **add**(`e`): `void`

Adds an element to a bit vector of a 64 byte bloom filter.

#### Parameters

• **e**: `Uint8Array`

The element to add

#### Returns

`void`

#### Throws

#### Defined in

packages/utils/types/Bloom.d.ts:16

***

### check()

> **check**(`e`): `boolean`

Checks if an element is in the bloom.

#### Parameters

• **e**: `Uint8Array`

The element to check

#### Returns

`boolean`

#### Throws

#### Defined in

packages/utils/types/Bloom.d.ts:22

***

### multiCheck()

> **multiCheck**(`topics`): `boolean`

Checks if multiple topics are in a bloom.

#### Parameters

• **topics**: `Uint8Array`[]

#### Returns

`boolean`

`true` if every topic is in the bloom

#### Throws

#### Defined in

packages/utils/types/Bloom.d.ts:28

***

### or()

> **or**(`bloom`): `void`

Bitwise or blooms together.

#### Parameters

• **bloom**: [`Bloom`](Bloom.md)

#### Returns

`void`

#### Throws

#### Defined in

packages/utils/types/Bloom.d.ts:33
