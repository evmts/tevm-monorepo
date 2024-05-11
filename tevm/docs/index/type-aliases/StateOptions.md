**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > StateOptions

# Type alias: StateOptions

> **StateOptions**: `object`

## Type declaration

### currentStateRoot

> **currentStateRoot**?: `Hex`

### fork

> **fork**?: [`ForkOptions`](../../state/interfaces/ForkOptions.md)

### genesisState

> **genesisState**?: [`TevmState`](TevmState.md)

### loggingLevel

> **`readonly`** **loggingLevel**?: `LogOptions`[`"level"`]

Configure logging options for the client

### onCommit

> **onCommit**?: (`stateManager`) => `void`

Called when state manager commits state

#### Parameters

▪ **stateManager**: [`BaseState`](../../state/type-aliases/BaseState.md)

### stateRoots

> **stateRoots**?: [`StateRoots`](../../state/type-aliases/StateRoots.md)

## Source

packages/state/dist/index.d.ts:167

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
