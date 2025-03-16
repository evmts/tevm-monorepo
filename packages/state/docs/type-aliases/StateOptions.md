[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / StateOptions

# Type Alias: StateOptions

> **StateOptions**: `object`

Defined in: [packages/state/src/state-types/StateOptions.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/StateOptions.ts#L21)

[Description of what this type represents]

## Type declaration

### accountsCache?

> `readonly` `optional` **accountsCache**: [`AccountCache`](../classes/AccountCache.md)

Optionally configure the accounts cache

### contractCache?

> `readonly` `optional` **contractCache**: [`ContractCache`](../classes/ContractCache.md)

Optionally configure and pass in your own ContractCache

### currentStateRoot?

> `optional` **currentStateRoot**: `Hex`

### fork?

> `optional` **fork**: [`ForkOptions`](../interfaces/ForkOptions.md)

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

[`BaseState`](BaseState.md)

#### Returns

`void`

### stateRoots?

> `optional` **stateRoots**: [`StateRoots`](StateRoots.md)

### storageCache?

> `readonly` `optional` **storageCache**: [`StorageCache`](../classes/StorageCache.md)

Optionally configure and pass in your own StorageCache

## Example

```typescript
import { StateOptions } from '[package-path]'

const value: StateOptions = {
  // Initialize properties
}
```
