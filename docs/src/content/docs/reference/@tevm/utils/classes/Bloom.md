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

#### Source

[packages/utils/src/Bloom.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L20)

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

#### Source

[packages/utils/src/Bloom.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L33)

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

[packages/utils/src/Bloom.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L50)

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

[packages/utils/src/Bloom.ts:72](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L72)

***

### or()

> **or**(`bloom`): `void`

Bitwise or blooms together.

#### Parameters

• **bloom**: [`Bloom`](/reference/tevm/utils/classes/bloom/)

#### Returns

`void`

#### Source

[packages/utils/src/Bloom.ts:79](https://github.com/evmts/tevm-monorepo/blob/main/packages/utils/src/Bloom.ts#L79)
