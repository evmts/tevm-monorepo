[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / StateAction

# Type Alias: StateAction\<T\>

> **StateAction**\<`T`\> = (`baseState`, `skipFetchingFromFork?`) => [`StateManager`](../interfaces/StateManager.md)\[`T`\]

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* keyof [`StateManager`](../interfaces/StateManager.md) |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `baseState` | [`BaseState`](BaseState.md) |
| `skipFetchingFromFork?` | `boolean` |

## Returns

[`StateManager`](../interfaces/StateManager.md)\[`T`\]
