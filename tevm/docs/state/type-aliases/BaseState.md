**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [state](../README.md) > BaseState

# Type alias: BaseState

> **BaseState**: `object`

The core data structure powering the state manager internally

## Type declaration

### \_caches

> **\_caches**: [`StateCache`](StateCache.md)

### \_currentStateRoot

> **\_currentStateRoot**: `Uint8Array`

### \_options

> **\_options**: [`StateOptions`](../../index/type-aliases/StateOptions.md)

### \_stateRoots

> **\_stateRoots**: [`StateRoots`](StateRoots.md)

Mapping of hashes to State roots

### ready

> **ready**: () => `Promise`\<`true`\>

## Source

packages/state/dist/index.d.ts:100

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
