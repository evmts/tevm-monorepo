[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / getAppliedKey

# Function: ~~getAppliedKey()~~

> **getAppliedKey**(`baseState`, `skipFetchingFromFork?`): `undefined` \| (`address`) => `Uint8Array`

Defined in: [packages/state/src/actions/getAppliedKey.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/getAppliedKey.js#L9)

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
