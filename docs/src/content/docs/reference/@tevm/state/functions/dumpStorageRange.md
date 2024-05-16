---
editUrl: false
next: false
prev: false
title: "dumpStorageRange"
---

> **dumpStorageRange**(`baseState`): (`address`, `startKey`, `limit`) => `Promise`\<[`StorageRange`](/reference/tevm/common/interfaces/storagerange/)\>

## Parameters

• **baseState**: [`BaseState`](/reference/tevm/state/type-aliases/basestate/)

## Returns

`Function`

### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

• **startKey**: `bigint`

• **limit**: `number`

### Returns

`Promise`\<[`StorageRange`](/reference/tevm/common/interfaces/storagerange/)\>

## Source

[packages/state/src/actions/dumpStorageRange.js:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/dumpStorageRange.js#L4)
