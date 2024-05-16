---
editUrl: false
next: false
prev: false
title: "Bloom"
---

## Constructors

### new Bloom()

> **new Bloom**(`bitvector`?): [`Bloom`](/reference/tevm/utils/classes/bloom/)

Represents a Bloom filter.

#### Parameters

• **bitvector?**: `Uint8Array`

#### Returns

[`Bloom`](/reference/tevm/utils/classes/bloom/)

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

[packages/utils/src/Bloom.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L29)

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

[packages/utils/src/Bloom.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L46)

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

[packages/utils/src/Bloom.ts:68](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L68)

***

### or()

> **or**(`bloom`): `void`

Bitwise or blooms together.

#### Parameters

• **bloom**: [`Bloom`](/reference/tevm/utils/classes/bloom/)

#### Returns

`void`

#### Source

[packages/utils/src/Bloom.ts:75](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L75)
