[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / getAppliedKey

# ~~Function: getAppliedKey()~~

> **getAppliedKey**(`baseState`, `skipFetchingFromFork?`): ((`address`) => `Uint8Array`) \| `undefined`

Defined in: [tevm-monorepo/packages/state/src/actions/getAppliedKey.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/getAppliedKey.js#L9)

## Parameters

| Parameter | Type |
| ------ | ------ |
| `baseState` | [`BaseState`](../type-aliases/BaseState.md) |
| `skipFetchingFromFork?` | `boolean` |

## Returns

((`address`) => `Uint8Array`) \| `undefined`

## Deprecated

Returns the applied key for a given address
Used for saving preimages
