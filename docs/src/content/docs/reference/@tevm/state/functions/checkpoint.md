---
editUrl: false
next: false
prev: false
title: "checkpoint"
---

> **checkpoint**(`baseState`): () => `Promise`\<`void`\>

Checkpoints the current change-set to the instance since the
last call to checkpoint.

## Parameters

• **baseState**: [`BaseState`](/reference/tevm/state/type-aliases/basestate/)

## Returns

`Function`

### Returns

`Promise`\<`void`\>

## Source

[packages/state/src/actions/checkpoint.js:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/checkpoint.js#L6)
