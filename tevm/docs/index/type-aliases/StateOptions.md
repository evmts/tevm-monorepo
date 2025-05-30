[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / StateOptions

# Type Alias: StateOptions

> **StateOptions** = `object`

Defined in: packages/state/dist/index.d.ts:313

Configuration options for the Tevm state manager.
Controls forking, initial state, caching, and event handling.

## Example

```typescript
import { StateOptions } from '@tevm/state'
import { http } from 'viem'

const value: StateOptions = {
  fork: {
    transport: http('https://mainnet.infura.io/v3/your-api-key'),
    blockTag: 'latest'
  },
  loggingLevel: 'debug'
}
```

## Properties

### accountsCache?

> `readonly` `optional` **accountsCache**: [`AccountCache`](../../state/classes/AccountCache.md)

Defined in: packages/state/dist/index.d.ts:337

Optionally configure the accounts cache

***

### contractCache?

> `readonly` `optional` **contractCache**: [`ContractCache`](../../state/classes/ContractCache.md)

Defined in: packages/state/dist/index.d.ts:329

Optionally configure and pass in your own ContractCache

***

### currentStateRoot?

> `optional` **currentStateRoot**: [`Hex`](Hex.md)

Defined in: packages/state/dist/index.d.ts:316

***

### fork?

> `optional` **fork**: [`ForkOptions`](../../state/interfaces/ForkOptions.md)

Defined in: packages/state/dist/index.d.ts:314

***

### genesisState?

> `optional` **genesisState**: [`TevmState`](TevmState.md)

Defined in: packages/state/dist/index.d.ts:315

***

### loggingLevel?

> `readonly` `optional` **loggingLevel**: `LogOptions`\[`"level"`\]

Defined in: packages/state/dist/index.d.ts:325

Configure logging options for the client

***

### onCommit()?

> `optional` **onCommit**: (`stateManager`) => `void`

Defined in: packages/state/dist/index.d.ts:321

Called when state manager commits state

#### Parameters

##### stateManager

[`BaseState`](../../state/type-aliases/BaseState.md)

#### Returns

`void`

***

### stateRoots?

> `optional` **stateRoots**: [`StateRoots`](../../state/type-aliases/StateRoots.md)

Defined in: packages/state/dist/index.d.ts:317

***

### storageCache?

> `readonly` `optional` **storageCache**: [`StorageCache`](../../state/classes/StorageCache.md)

Defined in: packages/state/dist/index.d.ts:333

Optionally configure and pass in your own StorageCache
