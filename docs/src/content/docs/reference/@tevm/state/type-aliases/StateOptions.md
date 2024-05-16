---
editUrl: false
next: false
prev: false
title: "StateOptions"
---

> **StateOptions**: `object`

## Type declaration

### currentStateRoot?

> `optional` **currentStateRoot**: `Hex`

### fork?

> `optional` **fork**: [`ForkOptions`](/reference/tevm/state/interfaces/forkoptions/)

### genesisState?

> `optional` **genesisState**: [`TevmState`](/reference/tevm/state/type-aliases/tevmstate/)

### loggingLevel?

> `optional` `readonly` **loggingLevel**: `LogOptions`\[`"level"`\]

Configure logging options for the client

### onCommit()?

> `optional` **onCommit**: (`stateManager`) => `void`

Called when state manager commits state

#### Parameters

• **stateManager**: [`BaseState`](/reference/tevm/state/type-aliases/basestate/)

#### Returns

`void`

### stateRoots?

> `optional` **stateRoots**: [`StateRoots`](/reference/tevm/state/type-aliases/stateroots/)

## Source

[packages/state/src/state-types/StateOptions.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/StateOptions.ts#L8)
