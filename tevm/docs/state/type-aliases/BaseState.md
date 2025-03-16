[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / BaseState

# Type Alias: BaseState

> **BaseState**: `object`

Defined in: packages/state/dist/index.d.ts:188

**`Internal`**

The core data structure powering the state manager internally

## Type declaration

### caches

> **caches**: [`StateCache`](StateCache.md)

### forkCache

> **forkCache**: [`StateCache`](StateCache.md)

### getCurrentStateRoot()

> **getCurrentStateRoot**: () => [`Hex`](../../index/type-aliases/Hex.md)

#### Returns

[`Hex`](../../index/type-aliases/Hex.md)

### logger

> **logger**: `Logger`

### options

> **options**: [`StateOptions`](../../index/type-aliases/StateOptions.md)

### ready()

> **ready**: () => `Promise`\<`true`\>

#### Returns

`Promise`\<`true`\>

### setCurrentStateRoot()

> **setCurrentStateRoot**: (`newStateRoot`) => `void`

#### Parameters

##### newStateRoot

[`Hex`](../../index/type-aliases/Hex.md)

#### Returns

`void`

### stateRoots

> **stateRoots**: [`StateRoots`](StateRoots.md)

Mapping of hashes to State roots
