[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / revert

# Function: revert()

> **revert**(`baseState`, `skipFetchingFromFork`?): () => `Promise`\<`void`\>

Defined in: packages/state/dist/index.d.ts:498

Commits the current change-set to the instance since the
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
