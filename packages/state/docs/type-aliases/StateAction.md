[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / StateAction

# Type Alias: StateAction\<T\>

> **StateAction**\<`T`\> = (`baseState`, `skipFetchingFromFork?`) => [`StateManager`](../interfaces/StateManager.md)\[`T`\]

Defined in: [tevm-monorepo/packages/state/src/state-types/StateAction.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/StateAction.ts#L4)

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
