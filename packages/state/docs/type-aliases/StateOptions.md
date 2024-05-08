**@tevm/state** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > StateOptions

# Type alias: StateOptions

> **StateOptions**: `object`

## Type declaration

### currentStateRoot

> **currentStateRoot**?: `Hex`

### fork

> **fork**?: [`ForkOptions`](../interfaces/ForkOptions.md)

### genesisState

> **genesisState**?: [`TevmState`](TevmState.md)

### onCommit

> **onCommit**?: (`stateManager`) => `void`

Called when state manager commits state

#### Parameters

▪ **stateManager**: [`BaseState`](BaseState.md)

### stateRoots

> **stateRoots**?: [`StateRoots`](StateRoots.md)

## Source

[packages/state/src/state-types/StateOptions.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/StateOptions.ts#L7)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
