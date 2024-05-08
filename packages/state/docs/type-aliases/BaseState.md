**@tevm/state** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > BaseState

# Type alias: BaseState

> **BaseState**: `object`

The core data structure powering the state manager internally

## Type declaration

### caches

> **caches**: [`StateCache`](StateCache.md)

### getCurrentStateRoot

> **getCurrentStateRoot**: () => `Hex`

### options

> **options**: [`StateOptions`](StateOptions.md)

### ready

> **ready**: () => `Promise`\<`true`\>

### setCurrentStateRoot

> **setCurrentStateRoot**: (`newStateRoot`) => `void`

#### Parameters

▪ **newStateRoot**: `Hex`

### stateRoots

> **stateRoots**: [`StateRoots`](StateRoots.md)

Mapping of hashes to State roots

## Source

[packages/state/src/BaseState.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L8)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
