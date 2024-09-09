---
editUrl: false
next: false
prev: false
title: "dumpStorageRange"
---

> **dumpStorageRange**(`baseState`, `skipFetchingFromFork`?): (`address`, `startKey`, `limit`) => `Promise`\<[`StorageRange`](/reference/tevm/common/interfaces/storagerange/)\>

## Parameters

• **baseState**: [`BaseState`](/reference/tevm/state/type-aliases/basestate/)

• **skipFetchingFromFork?**: `boolean`

## Returns

`Function`

### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

• **startKey**: `bigint`

• **limit**: `number`

### Returns

`Promise`\<[`StorageRange`](/reference/tevm/common/interfaces/storagerange/)\>

## Defined in

[packages/state/src/actions/dumpStorageRange.js:7](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/state/src/actions/dumpStorageRange.js#L7)
