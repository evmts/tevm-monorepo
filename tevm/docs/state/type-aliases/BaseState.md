**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [state](../README.md) > BaseState

# Type alias: BaseState

> **BaseState**: `object`

The core data structure powering the state manager internally

## Type declaration

### caches

> **caches**: [`StateCache`](StateCache.md)

### getCurrentStateRoot

> **getCurrentStateRoot**: () => [`Hex`](../../index/type-aliases/Hex.md)

### logger

> **logger**: `Logger`

### options

> **options**: [`StateOptions`](../../index/type-aliases/StateOptions.md)

### ready

> **ready**: () => `Promise`\<`true`\>

### setCurrentStateRoot

> **setCurrentStateRoot**: (`newStateRoot`) => `void`

#### Parameters

▪ **newStateRoot**: [`Hex`](../../index/type-aliases/Hex.md)

### stateRoots

> **stateRoots**: [`StateRoots`](StateRoots.md)

Mapping of hashes to State roots

## Source

packages/state/dist/index.d.ts:102

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
