**@tevm/utils** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > Bloom

# Class: Bloom

## Constructors

### new Bloom(bitvector)

> **new Bloom**(`bitvector`?): [`Bloom`](Bloom.md)

Represents a Bloom filter.

#### Parameters

▪ **bitvector?**: `Uint8Array`

#### Source

[packages/utils/src/Bloom.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L16)

## Properties

### bitvector

> **bitvector**: `Uint8Array`

#### Source

[packages/utils/src/Bloom.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L11)

## Methods

### add()

> **add**(`e`): `void`

Adds an element to a bit vector of a 64 byte bloom filter.

#### Parameters

▪ **e**: `Uint8Array`

The element to add

#### Source

[packages/utils/src/Bloom.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L29)

***

### check()

> **check**(`e`): `boolean`

Checks if an element is in the bloom.

#### Parameters

▪ **e**: `Uint8Array`

The element to check

#### Source

[packages/utils/src/Bloom.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L46)

***

### multiCheck()

> **multiCheck**(`topics`): `boolean`

Checks if multiple topics are in a bloom.

#### Parameters

▪ **topics**: `Uint8Array`[]

#### Returns

`true` if every topic is in the bloom

#### Source

[packages/utils/src/Bloom.ts:68](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L68)

***

### or()

> **or**(`bloom`): `void`

Bitwise or blooms together.

#### Parameters

▪ **bloom**: [`Bloom`](Bloom.md)

#### Source

[packages/utils/src/Bloom.ts:75](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L75)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
