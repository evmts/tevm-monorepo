[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / BaseState

# Type Alias: BaseState

> **BaseState** = `object`

Defined in: [packages/state/src/BaseState.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L9)

**`Internal`**

The core data structure powering the state manager internally

## Properties

### caches

> **caches**: [`StateCache`](StateCache.md)

Defined in: [packages/state/src/BaseState.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L18)

***

### forkCache

> **forkCache**: [`StateCache`](StateCache.md)

Defined in: [packages/state/src/BaseState.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L20)

***

### getCurrentStateRoot()

> **getCurrentStateRoot**: () => `Hex`

Defined in: [packages/state/src/BaseState.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L21)

#### Returns

`Hex`

***

### logger

> **logger**: `Logger`

Defined in: [packages/state/src/BaseState.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L12)

***

### options

> **options**: [`StateOptions`](StateOptions.md)

Defined in: [packages/state/src/BaseState.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L17)

***

### ready()

> **ready**: () => `Promise`\<`true`\>

Defined in: [packages/state/src/BaseState.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L11)

#### Returns

`Promise`\<`true`\>

***

### setCurrentStateRoot()

> **setCurrentStateRoot**: (`newStateRoot`) => `void`

Defined in: [packages/state/src/BaseState.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L22)

#### Parameters

##### newStateRoot

`Hex`

#### Returns

`void`

***

### stateRoots

> **stateRoots**: [`StateRoots`](StateRoots.md)

Defined in: [packages/state/src/BaseState.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L16)

Mapping of hashes to State roots
