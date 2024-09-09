---
editUrl: false
next: false
prev: false
title: "setStateRoot"
---

> **setStateRoot**(`baseState`, `skipFetchingFromFork`?): (`stateRoot`, `clearCache`?) => `Promise`\<`void`\>

Changes the currently loaded state root

## Parameters

• **baseState**: [`BaseState`](/reference/tevm/state/type-aliases/basestate/)

• **skipFetchingFromFork?**: `boolean`

## Returns

`Function`

### Parameters

• **stateRoot**: `Uint8Array`

• **clearCache?**: `boolean`

### Returns

`Promise`\<`void`\>

## Defined in

[packages/state/src/actions/setStateRoot.js:23](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/state/src/actions/setStateRoot.js#L23)
