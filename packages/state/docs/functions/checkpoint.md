[**@tevm/state**](../README.md) • **Docs**

***

[@tevm/state](../globals.md) / checkpoint

# Function: checkpoint()

> **checkpoint**(`baseState`, `skipFetchingFromFork`?): () => `Promise`\<`void`\>

Checkpoints the current change-set to the instance since the
last call to checkpoint.

## Parameters

• **baseState**: [`BaseState`](../type-aliases/BaseState.md)

• **skipFetchingFromFork?**: `boolean`

## Returns

`Function`

### Returns

`Promise`\<`void`\>

## Source

[packages/state/src/actions/checkpoint.js:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/checkpoint.js#L6)
