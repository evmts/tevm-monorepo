[**@tevm/state**](../README.md) • **Docs**

***

[@tevm/state](../globals.md) / StateOptions

# Type alias: StateOptions

> **StateOptions**: `object`

## Type declaration

### currentStateRoot?

> `optional` **currentStateRoot**: `Hex`

### fork?

> `optional` **fork**: [`ForkOptions`](../interfaces/ForkOptions.md)

### genesisState?

> `optional` **genesisState**: [`TevmState`](TevmState.md)

### loggingLevel?

> `optional` `readonly` **loggingLevel**: `LogOptions`\[`"level"`\]

Configure logging options for the client

### onCommit()?

> `optional` **onCommit**: (`stateManager`) => `void`

Called when state manager commits state

#### Parameters

• **stateManager**: [`BaseState`](BaseState.md)

#### Returns

`void`

### stateRoots?

> `optional` **stateRoots**: [`StateRoots`](StateRoots.md)

## Source

[packages/state/src/state-types/StateOptions.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/StateOptions.ts#L8)
