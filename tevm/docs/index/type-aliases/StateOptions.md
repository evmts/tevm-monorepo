[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / StateOptions

# Type Alias: StateOptions

> **StateOptions** = `object`

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

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="accountscache"></a> `accountsCache?` | `readonly` | [`AccountCache`](../../state/classes/AccountCache.md) | Optionally configure the accounts cache |
| <a id="contractcache"></a> `contractCache?` | `readonly` | [`ContractCache`](../../state/classes/ContractCache.md) | Optionally configure and pass in your own ContractCache |
| <a id="currentstateroot"></a> `currentStateRoot?` | `public` | [`Hex`](Hex.md) | - |
| <a id="fork"></a> `fork?` | `public` | [`ForkOptions`](../../state/interfaces/ForkOptions.md) | - |
| <a id="genesisstate"></a> `genesisState?` | `public` | [`TevmState`](TevmState.md) | - |
| <a id="logginglevel"></a> `loggingLevel?` | `readonly` | `LogOptions`\[`"level"`\] | Configure logging options for the client |
| <a id="oncommit"></a> `onCommit?` | `public` | (`stateManager`) => `void` | Called when state manager commits state |
| <a id="stateroots"></a> `stateRoots?` | `public` | [`StateRoots`](../../state/type-aliases/StateRoots.md) | - |
| <a id="storagecache"></a> `storageCache?` | `readonly` | [`StorageCache`](../../state/classes/StorageCache.md) | Optionally configure and pass in your own StorageCache |
