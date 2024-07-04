[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [state](../README.md) / checkpoint

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

## Defined in

packages/state/dist/index.d.ts:211
