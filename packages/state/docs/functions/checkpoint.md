[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / checkpoint

# Function: checkpoint()

> **checkpoint**(`baseState`, `skipFetchingFromFork`?): () => `Promise`\<`void`\>

Defined in: [packages/state/src/actions/checkpoint.js:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/checkpoint.js#L6)

Checkpoints the current change-set to the instance since the
last call to checkpoint.

## Parameters

### baseState

[`BaseState`](../type-aliases/BaseState.md)

### skipFetchingFromFork?

`boolean`

## Returns

`Function`

### Returns

`Promise`\<`void`\>
