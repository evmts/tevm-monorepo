---
editUrl: false
next: false
prev: false
title: "revert"
---

> **revert**(`baseState`): () => `Promise`\<`void`\>

Commits the current change-set to the instance since the
last call to checkpoint.

## Parameters

• **baseState**: [`BaseState`](/reference/tevm/state/type-aliases/basestate/)

## Returns

`Function`

### Returns

`Promise`\<`void`\>

## Source

[packages/state/src/actions/revert.js:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/revert.js#L6)
