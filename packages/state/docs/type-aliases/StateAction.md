[**@tevm/state**](../README.md) • **Docs**

***

[@tevm/state](../globals.md) / StateAction

# Type alias: StateAction()\<T\>

> **StateAction**\<`T`\>: (`baseState`, `skipFetchingFromFork`?) => [`StateManager`](../interfaces/StateManager.md)\[`T`\]

## Type parameters

• **T** *extends* keyof [`StateManager`](../interfaces/StateManager.md)

## Parameters

• **baseState**: [`BaseState`](BaseState.md)

• **skipFetchingFromFork?**: `boolean`

## Returns

[`StateManager`](../interfaces/StateManager.md)\[`T`\]

## Source

[packages/state/src/state-types/StateAction.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/StateAction.ts#L4)
