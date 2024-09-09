---
editUrl: false
next: false
prev: false
title: "StateOptions"
---

> **StateOptions**: `object`

## Type declaration

### accountsCache?

> `readonly` `optional` **accountsCache**: [`AccountCache`](/reference/tevm/state/classes/accountcache/)

Optionally configure the accounts cache

### contractCache?

> `readonly` `optional` **contractCache**: [`ContractCache`](/reference/tevm/state/classes/contractcache/)

Optionally configure and pass in your own ContractCache

### currentStateRoot?

> `optional` **currentStateRoot**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

### fork?

> `optional` **fork**: [`ForkOptions`](/reference/tevm/state/interfaces/forkoptions/)

### genesisState?

> `optional` **genesisState**: [`TevmState`](/reference/tevm/state/type-aliases/tevmstate/)

### loggingLevel?

> `readonly` `optional` **loggingLevel**: `LogOptions`\[`"level"`\]

Configure logging options for the client

### onCommit()?

> `optional` **onCommit**: (`stateManager`) => `void`

Called when state manager commits state

#### Parameters

• **stateManager**: [`BaseState`](/reference/tevm/state/type-aliases/basestate/)

#### Returns

`void`

### stateRoots?

> `optional` **stateRoots**: [`StateRoots`](/reference/tevm/state/type-aliases/stateroots/)

### storageCache?

> `readonly` `optional` **storageCache**: [`StorageCache`](/reference/tevm/state/classes/storagecache/)

Optionally configure and pass in your own StorageCache

## Defined in

[packages/state/src/state-types/StateOptions.ts:10](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/state/src/state-types/StateOptions.ts#L10)
