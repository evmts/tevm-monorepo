[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / StateAction

# Type Alias: StateAction()\<T\>

> **StateAction**\<`T`\> = (`baseState`, `skipFetchingFromFork?`) => [`StateManager`](../interfaces/StateManager.md)\[`T`\]

Defined in: packages/state/src/state-types/StateAction.ts:4

## Type Parameters

### T

`T` *extends* keyof [`StateManager`](../interfaces/StateManager.md)

## Parameters

### baseState

[`BaseState`](BaseState.md)

### skipFetchingFromFork?

`boolean`

## Returns

[`StateManager`](../interfaces/StateManager.md)\[`T`\]
