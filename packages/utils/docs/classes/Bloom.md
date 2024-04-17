**@tevm/utils** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/utils](../README.md) / Bloom

# Class: Bloom

## Constructors

### new Bloom(bitvector)

> **new Bloom**(`bitvector`?): [`Bloom`](Bloom.md)

Represents a Bloom filter.

#### Parameters

• **bitvector?**: `Uint8Array`

#### Returns

[`Bloom`](Bloom.md)

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

• **e**: `Uint8Array`

The element to add

#### Returns

`void`

#### Source

[packages/utils/src/Bloom.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L30)

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

[packages/utils/src/Bloom.ts:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L47)

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

[packages/utils/src/Bloom.ts:69](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L69)

***

### or()

> **or**(`bloom`): `void`

Bitwise or blooms together.

#### Parameters

• **bloom**: [`Bloom`](Bloom.md)

#### Returns

`void`

#### Source

[packages/utils/src/Bloom.ts:76](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L76)
