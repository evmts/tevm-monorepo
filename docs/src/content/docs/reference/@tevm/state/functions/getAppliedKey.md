---
editUrl: false
next: false
prev: false
title: "getAppliedKey"
---

> **getAppliedKey**(`baseState`, `skipFetchingFromFork`?): `undefined` \| (`address`) => `Uint8Array`

:::caution[Deprecated]
Returns the applied key for a given address
Used for saving preimages
:::

## Parameters

• **baseState**: [`BaseState`](/reference/tevm/state/type-aliases/basestate/)

• **skipFetchingFromFork?**: `boolean`

## Returns

`undefined` \| (`address`) => `Uint8Array`

## Source

[packages/state/src/actions/getAppliedKey.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/getAppliedKey.js#L9)
