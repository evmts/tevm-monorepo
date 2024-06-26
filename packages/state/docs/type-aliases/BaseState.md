[**@tevm/state**](../README.md) • **Docs**

***

[@tevm/state](../globals.md) / BaseState

# Type Alias: BaseState

> **BaseState**: `object`

**`Internal`**

The core data structure powering the state manager internally

## Type declaration

### caches

> **caches**: [`StateCache`](StateCache.md)

### getCurrentStateRoot()

> **getCurrentStateRoot**: () => `Hex`

#### Returns

`Hex`

### logger

> **logger**: `Logger`

### options

> **options**: [`StateOptions`](StateOptions.md)

### ready()

> **ready**: () => `Promise`\<`true`\>

#### Returns

`Promise`\<`true`\>

### setCurrentStateRoot()

> **setCurrentStateRoot**: (`newStateRoot`) => `void`

#### Parameters

• **newStateRoot**: `Hex`

#### Returns

`void`

### stateRoots

> **stateRoots**: [`StateRoots`](StateRoots.md)

Mapping of hashes to State roots

## Defined in

[packages/state/src/BaseState.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L9)
