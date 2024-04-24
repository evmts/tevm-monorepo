**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > StateOptions

# Type alias: StateOptions

> **StateOptions**: `object`

## Type declaration

### fork

> **fork**?: [`ForkOptions`](../../state/interfaces/ForkOptions.md)

### genesisState

> **genesisState**?: [`TevmState`](TevmState.md)

### onCommit

> **onCommit**?: (`stateManager`) => `void`

Called when state manager commits state

#### Parameters

▪ **stateManager**: [`BaseState`](../../state/type-aliases/BaseState.md)

### stateRoots

> **stateRoots**?: [`StateRoots`](../../state/type-aliases/StateRoots.md)

## Source

packages/state/types/state-types/StateOptions.d.ts:5

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
