**@tevm/state** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > BaseState

# Type alias: BaseState

> **BaseState**: `object`

The core data structure powering the state manager internally

## Type declaration

### \_caches

> **\_caches**: [`StateCache`](StateCache.md)

### \_currentStateRoot

> **\_currentStateRoot**: `Uint8Array`

### \_options

> **\_options**: [`StateOptions`](StateOptions.md)

### \_stateRoots

> **\_stateRoots**: [`StateRoots`](StateRoots.md)

Mapping of hashes to State roots

### ready

> **ready**: () => `Promise`\<`true`\>

## Source

[packages/state/src/BaseState.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L7)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
