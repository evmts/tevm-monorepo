---
editUrl: false
next: false
prev: false
title: "originalStorageCache"
---

> **originalStorageCache**(`baseState`, `skipFetchingFromFork`?): `object`

Commits the current change-set to the instance since the
last call to checkpoint.

## Parameters

• **baseState**: [`BaseState`](/reference/tevm/state/type-aliases/basestate/)

• **skipFetchingFromFork?**: `boolean`

## Returns

`object`

### clear()

#### Returns

`void`

### get()

#### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

• **key**: `Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\>

## Source

[packages/state/src/actions/originalStorageCache.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/originalStorageCache.js#L9)
