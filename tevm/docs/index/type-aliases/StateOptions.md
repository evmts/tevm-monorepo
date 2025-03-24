[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / StateOptions

# Type Alias: StateOptions

> **StateOptions** = `object`

Defined in: packages/state/dist/index.d.ts:288

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

Defined in: packages/state/dist/index.d.ts:312

Optionally configure the accounts cache

***

### contractCache?

> `readonly` `optional` **contractCache**: [`ContractCache`](../../state/classes/ContractCache.md)

Defined in: packages/state/dist/index.d.ts:304

Optionally configure and pass in your own ContractCache

***

### currentStateRoot?

> `optional` **currentStateRoot**: [`Hex`](Hex.md)

Defined in: packages/state/dist/index.d.ts:291

***

### fork?

> `optional` **fork**: [`ForkOptions`](../../state/interfaces/ForkOptions.md)

Defined in: packages/state/dist/index.d.ts:289

***

### genesisState?

> `optional` **genesisState**: [`TevmState`](TevmState.md)

Defined in: packages/state/dist/index.d.ts:290

***

### loggingLevel?

> `readonly` `optional` **loggingLevel**: `LogOptions`\[`"level"`\]

Defined in: packages/state/dist/index.d.ts:300

Configure logging options for the client

***

### onCommit()?

> `optional` **onCommit**: (`stateManager`) => `void`

Defined in: packages/state/dist/index.d.ts:296

Called when state manager commits state

#### Parameters

##### stateManager

[`BaseState`](../../state/type-aliases/BaseState.md)

#### Returns

`void`

***

### stateRoots?

> `optional` **stateRoots**: [`StateRoots`](../../state/type-aliases/StateRoots.md)

Defined in: packages/state/dist/index.d.ts:292

***

### storageCache?

> `readonly` `optional` **storageCache**: [`StorageCache`](../../state/classes/StorageCache.md)

Defined in: packages/state/dist/index.d.ts:308

Optionally configure and pass in your own StorageCache
