[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / BaseState

# Type Alias: BaseState

> **BaseState** = `object`

Defined in: packages/state/dist/index.d.ts:133

**`Internal`**

The core data structure powering the state manager internally

## Properties

### caches

> **caches**: [`StateCache`](StateCache.md)

Defined in: packages/state/dist/index.d.ts:141

***

### forkCache

> **forkCache**: [`StateCache`](StateCache.md)

Defined in: packages/state/dist/index.d.ts:142

***

### getCurrentStateRoot()

> **getCurrentStateRoot**: () => [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/state/dist/index.d.ts:143

#### Returns

[`Hex`](../../index/type-aliases/Hex.md)

***

### logger

> **logger**: `Logger`

Defined in: packages/state/dist/index.d.ts:135

***

### options

> **options**: [`StateOptions`](../../index/type-aliases/StateOptions.md)

Defined in: packages/state/dist/index.d.ts:140

***

### ready()

> **ready**: () => `Promise`\<`true`\>

Defined in: packages/state/dist/index.d.ts:134

#### Returns

`Promise`\<`true`\>

***

### setCurrentStateRoot()

> **setCurrentStateRoot**: (`newStateRoot`) => `void`

Defined in: packages/state/dist/index.d.ts:144

#### Parameters

##### newStateRoot

[`Hex`](../../index/type-aliases/Hex.md)

#### Returns

`void`

***

### stateRoots

> **stateRoots**: [`StateRoots`](StateRoots.md)

Defined in: packages/state/dist/index.d.ts:139

Mapping of hashes to State roots
