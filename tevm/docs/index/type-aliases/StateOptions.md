[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / StateOptions

# Type Alias: StateOptions

> **StateOptions**: `object`

Defined in: packages/state/dist/index.d.ts:175

## Type declaration

### accountsCache?

> `readonly` `optional` **accountsCache**: [`AccountCache`](../../state/classes/AccountCache.md)

Optionally configure the accounts cache

### contractCache?

> `readonly` `optional` **contractCache**: [`ContractCache`](../../state/classes/ContractCache.md)

Optionally configure and pass in your own ContractCache

### currentStateRoot?

> `optional` **currentStateRoot**: [`Hex`](Hex.md)

### fork?

> `optional` **fork**: [`ForkOptions`](../../state/interfaces/ForkOptions.md)

### genesisState?

> `optional` **genesisState**: [`TevmState`](TevmState.md)

### loggingLevel?

> `readonly` `optional` **loggingLevel**: `LogOptions`\[`"level"`\]

Configure logging options for the client

### onCommit()?

> `optional` **onCommit**: (`stateManager`) => `void`

Called when state manager commits state

#### Parameters

##### stateManager

[`BaseState`](../../state/type-aliases/BaseState.md)

#### Returns

`void`

### stateRoots?

> `optional` **stateRoots**: [`StateRoots`](../../state/type-aliases/StateRoots.md)

### storageCache?

> `readonly` `optional` **storageCache**: [`StorageCache`](../../state/classes/StorageCache.md)

Optionally configure and pass in your own StorageCache
