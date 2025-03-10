[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / getAppliedKey

# Function: ~~getAppliedKey()~~

> **getAppliedKey**(`baseState`, `skipFetchingFromFork`?): `undefined` \| (`address`) => `Uint8Array`

Defined in: packages/state/dist/index.d.ts:293

## Parameters

### baseState

[`BaseState`](../type-aliases/BaseState.md)

### skipFetchingFromFork?

`boolean`

## Returns

`undefined` \| (`address`) => `Uint8Array`

## Deprecated

Returns the applied key for a given address
Used for saving preimages
