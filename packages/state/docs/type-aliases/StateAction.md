[**@tevm/state**](../README.md) • **Docs**

***

[@tevm/state](../globals.md) / StateAction

# Type Alias: StateAction()\<T\>

> **StateAction**\<`T`\>: (`baseState`, `skipFetchingFromFork`?) => [`StateManager`](../interfaces/StateManager.md)\[`T`\]

## Type Parameters

• **T** *extends* keyof [`StateManager`](../interfaces/StateManager.md)

## Parameters

• **baseState**: [`BaseState`](BaseState.md)

• **skipFetchingFromFork?**: `boolean`

## Returns

[`StateManager`](../interfaces/StateManager.md)\[`T`\]

## Defined in

[packages/state/src/state-types/StateAction.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/StateAction.ts#L4)
