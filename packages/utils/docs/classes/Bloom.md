[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / Bloom

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

#### Source

[packages/utils/src/Bloom.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L21)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

#### Source

[packages/utils/src/Bloom.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L15)

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

#### Source

[packages/utils/src/Bloom.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L35)

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

#### Source

[packages/utils/src/Bloom.ts:58](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L58)

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

#### Source

[packages/utils/src/Bloom.ts:83](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L83)

***

### or()

> **or**(`bloom`): `void`

Bitwise or blooms together.

#### Parameters

• **bloom**: [`Bloom`](Bloom.md)

#### Returns

`void`

#### Throws

#### Source

[packages/utils/src/Bloom.ts:91](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L91)
