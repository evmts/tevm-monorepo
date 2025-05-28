[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / BaseState

# Type Alias: BaseState

> **BaseState** = `object`

Defined in: packages/state/dist/index.d.ts:190

**`Internal`**

The core data structure powering the state manager internally

## Properties

### caches

> **caches**: [`StateCache`](StateCache.md)

Defined in: packages/state/dist/index.d.ts:198

***

### forkCache

> **forkCache**: [`StateCache`](StateCache.md)

Defined in: packages/state/dist/index.d.ts:199

***

### getCurrentStateRoot()

> **getCurrentStateRoot**: () => [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/state/dist/index.d.ts:200

#### Returns

[`Hex`](../../index/type-aliases/Hex.md)

***

### logger

> **logger**: `Logger`

Defined in: packages/state/dist/index.d.ts:192

***

### options

> **options**: [`StateOptions`](../../index/type-aliases/StateOptions.md)

Defined in: packages/state/dist/index.d.ts:197

***

### ready()

> **ready**: () => `Promise`\<`true`\>

Defined in: packages/state/dist/index.d.ts:191

#### Returns

`Promise`\<`true`\>

***

### setCurrentStateRoot()

> **setCurrentStateRoot**: (`newStateRoot`) => `void`

Defined in: packages/state/dist/index.d.ts:201

#### Parameters

##### newStateRoot

[`Hex`](../../index/type-aliases/Hex.md)

#### Returns

`void`

***

### stateRoots

> **stateRoots**: [`StateRoots`](StateRoots.md)

Defined in: packages/state/dist/index.d.ts:196

Mapping of hashes to State roots
