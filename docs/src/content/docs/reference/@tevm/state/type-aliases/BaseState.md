---
editUrl: false
next: false
prev: false
title: "BaseState"
---

`Internal`

> **BaseState**: `object`

The core data structure powering the state manager internally

## Type declaration

### caches

> **caches**: [`StateCache`](/reference/tevm/state/type-aliases/statecache/)

### getCurrentStateRoot()

> **getCurrentStateRoot**: () => [`Hex`](/reference/tevm/utils/type-aliases/hex/)

#### Returns

[`Hex`](/reference/tevm/utils/type-aliases/hex/)

### logger

> **logger**: `Logger`

### options

> **options**: [`StateOptions`](/reference/tevm/state/type-aliases/stateoptions/)

### ready()

> **ready**: () => `Promise`\<`true`\>

#### Returns

`Promise`\<`true`\>

### setCurrentStateRoot()

> **setCurrentStateRoot**: (`newStateRoot`) => `void`

#### Parameters

• **newStateRoot**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

#### Returns

`void`

### stateRoots

> **stateRoots**: [`StateRoots`](/reference/tevm/state/type-aliases/stateroots/)

Mapping of hashes to State roots

## Source

[packages/state/src/BaseState.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/BaseState.ts#L9)
