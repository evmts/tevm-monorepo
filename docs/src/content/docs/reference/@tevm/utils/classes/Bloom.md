---
editUrl: false
next: false
prev: false
title: "Bloom"
---

A simple Bloom filter implementation originally from ethereumjs

## Constructors

### new Bloom()

> **new Bloom**(`bitvector`?): [`Bloom`](/reference/tevm/utils/classes/bloom/)

Represents a Bloom filter.

#### Parameters

• **bitvector?**: `Uint8Array`

#### Returns

[`Bloom`](/reference/tevm/utils/classes/bloom/)

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

[packages/utils/src/Bloom.ts:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L53)

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

[packages/utils/src/Bloom.ts:78](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L78)

***

### or()

> **or**(`bloom`): `void`

Bitwise or blooms together.

#### Parameters

• **bloom**: [`Bloom`](/reference/tevm/utils/classes/bloom/)

#### Returns

`void`

#### Throws

#### Source

[packages/utils/src/Bloom.ts:86](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L86)
