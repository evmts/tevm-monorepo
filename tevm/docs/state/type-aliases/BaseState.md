[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / BaseState

# Type Alias: BaseState

> **BaseState** = `object`

Defined in: packages/state/dist/index.d.ts:160

**`Internal`**

The core data structure powering the state manager internally

## Properties

### caches

> **caches**: [`StateCache`](StateCache.md)

Defined in: packages/state/dist/index.d.ts:168

***

### forkCache

> **forkCache**: [`StateCache`](StateCache.md)

Defined in: packages/state/dist/index.d.ts:169

***

### getCurrentStateRoot()

> **getCurrentStateRoot**: () => [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/state/dist/index.d.ts:170

#### Returns

[`Hex`](../../index/type-aliases/Hex.md)

***

### logger

> **logger**: `Logger`

Defined in: packages/state/dist/index.d.ts:162

***

### options

> **options**: [`StateOptions`](../../index/type-aliases/StateOptions.md)

Defined in: packages/state/dist/index.d.ts:167

***

### ready()

> **ready**: () => `Promise`\<`true`\>

Defined in: packages/state/dist/index.d.ts:161

#### Returns

`Promise`\<`true`\>

***

### setCurrentStateRoot()

> **setCurrentStateRoot**: (`newStateRoot`) => `void`

Defined in: packages/state/dist/index.d.ts:171

#### Parameters

##### newStateRoot

[`Hex`](../../index/type-aliases/Hex.md)

#### Returns

`void`

***

### stateRoots

> **stateRoots**: [`StateRoots`](StateRoots.md)

Defined in: packages/state/dist/index.d.ts:166

Mapping of hashes to State roots
