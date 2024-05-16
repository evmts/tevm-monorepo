[**@tevm/state**](../README.md) • **Docs**

***

[@tevm/state](../globals.md) / commit

# Function: commit()

> **commit**(`baseState`): (`createNewStateRoot`?) => `Promise`\<`void`\>

Commits the current change-set to the instance since the
last call to checkpoint.

## Parameters

• **baseState**: [`BaseState`](../type-aliases/BaseState.md)

## Returns

`Function`

Commits the current state.

### Parameters

• **createNewStateRoot?**: `boolean`

Whether to create a new state root
Defaults to true.
This api is not stable

### Returns

`Promise`\<`void`\>

## Source

[packages/state/src/actions/commit.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/commit.js#L11)
