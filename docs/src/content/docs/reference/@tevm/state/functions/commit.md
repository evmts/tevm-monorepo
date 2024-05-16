---
editUrl: false
next: false
prev: false
title: "commit"
---

> **commit**(`baseState`): (`createNewStateRoot`?) => `Promise`\<`void`\>

Commits the current change-set to the instance since the
last call to checkpoint.

## Parameters

• **baseState**: [`BaseState`](/reference/tevm/state/type-aliases/basestate/)

## Returns

`Function`

Commits the current state.

### Parameters

• **createNewStateRoot?**: `boolean`

Whether to create a new state root
Defaults to true.
This api is not stable

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

### Returns

`Promise`\<`void`\>

## Source

[packages/state/src/actions/commit.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/commit.js#L11)
