[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / StateOptions

# Type Alias: StateOptions

> **StateOptions** = `object`

Defined in: packages/state/src/state-types/StateOptions.ts:27

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

> `readonly` `optional` **accountsCache**: [`AccountCache`](../classes/AccountCache.md)

Defined in: packages/state/src/state-types/StateOptions.ts:51

Optionally configure the accounts cache

***

### contractCache?

> `readonly` `optional` **contractCache**: [`ContractCache`](../classes/ContractCache.md)

Defined in: packages/state/src/state-types/StateOptions.ts:43

Optionally configure and pass in your own ContractCache

***

### currentStateRoot?

> `optional` **currentStateRoot**: `Hex`

Defined in: packages/state/src/state-types/StateOptions.ts:30

***

### fork?

> `optional` **fork**: [`ForkOptions`](../interfaces/ForkOptions.md)

Defined in: packages/state/src/state-types/StateOptions.ts:28

***

### genesisState?

> `optional` **genesisState**: [`TevmState`](TevmState.md)

Defined in: packages/state/src/state-types/StateOptions.ts:29

***

### loggingLevel?

> `readonly` `optional` **loggingLevel**: `LogOptions`\[`"level"`\]

Defined in: packages/state/src/state-types/StateOptions.ts:39

Configure logging options for the client

***

### onCommit()?

> `optional` **onCommit**: (`stateManager`) => `void`

Defined in: packages/state/src/state-types/StateOptions.ts:35

Called when state manager commits state

#### Parameters

##### stateManager

[`BaseState`](BaseState.md)

#### Returns

`void`

***

### stateRoots?

> `optional` **stateRoots**: [`StateRoots`](StateRoots.md)

Defined in: packages/state/src/state-types/StateOptions.ts:31

***

### storageCache?

> `readonly` `optional` **storageCache**: [`StorageCache`](../classes/StorageCache.md)

Defined in: packages/state/src/state-types/StateOptions.ts:47

Optionally configure and pass in your own StorageCache
