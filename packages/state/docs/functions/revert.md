[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / revert

# Function: revert()

> **revert**(`baseState`, `skipFetchingFromFork?`): () => `Promise`\<`void`\>

Defined in: packages/state/src/actions/revert.js:6

Commits the current change-set to the instance since the
last call to checkpoint.

## Parameters

### baseState

[`BaseState`](../type-aliases/BaseState.md)

### skipFetchingFromFork?

`boolean`

## Returns

> (): `Promise`\<`void`\>

### Returns

`Promise`\<`void`\>
