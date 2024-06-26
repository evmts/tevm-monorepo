[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / StateOptions

# Type Alias: StateOptions

> **StateOptions**: `object`

## Type declaration

### currentStateRoot?

> `optional` **currentStateRoot**: [`Hex`](Hex.md)

### fork?

> `optional` **fork**: [`ForkOptions`](../../state/interfaces/ForkOptions.md)

### genesisState?

> `optional` **genesisState**: [`TevmState`](TevmState.md)

### loggingLevel?

> `readonly` `optional` **loggingLevel**: `LogOptions`\[`"level"`\]

Configure logging options for the client

### onCommit()?

> `optional` **onCommit**: (`stateManager`) => `void`

Called when state manager commits state

#### Parameters

• **stateManager**: [`BaseState`](../../state/type-aliases/BaseState.md)

#### Returns

`void`

### stateRoots?

> `optional` **stateRoots**: [`StateRoots`](../../state/type-aliases/StateRoots.md)

## Defined in

packages/state/dist/index.d.ts:174
