[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / StateOptions

# Type Alias: StateOptions

> **StateOptions** = `object`

Defined in: [tevm-monorepo/packages/state/src/state-types/StateOptions.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/StateOptions.ts#L27)

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

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="accountscache"></a> `accountsCache?` | `readonly` | [`AccountCache`](../classes/AccountCache.md) | Optionally configure the accounts cache | [tevm-monorepo/packages/state/src/state-types/StateOptions.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/StateOptions.ts#L51) |
| <a id="contractcache"></a> `contractCache?` | `readonly` | [`ContractCache`](../classes/ContractCache.md) | Optionally configure and pass in your own ContractCache | [tevm-monorepo/packages/state/src/state-types/StateOptions.ts:43](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/StateOptions.ts#L43) |
| <a id="currentstateroot"></a> `currentStateRoot?` | `public` | `Hex` | - | [tevm-monorepo/packages/state/src/state-types/StateOptions.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/StateOptions.ts#L30) |
| <a id="fork"></a> `fork?` | `public` | [`ForkOptions`](../interfaces/ForkOptions.md) | - | [tevm-monorepo/packages/state/src/state-types/StateOptions.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/StateOptions.ts#L28) |
| <a id="genesisstate"></a> `genesisState?` | `public` | [`TevmState`](TevmState.md) | - | [tevm-monorepo/packages/state/src/state-types/StateOptions.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/StateOptions.ts#L29) |
| <a id="logginglevel"></a> `loggingLevel?` | `readonly` | `LogOptions`\[`"level"`\] | Configure logging options for the client | [tevm-monorepo/packages/state/src/state-types/StateOptions.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/StateOptions.ts#L39) |
| <a id="oncommit"></a> `onCommit?` | `public` | (`stateManager`) => `void` | Called when state manager commits state | [tevm-monorepo/packages/state/src/state-types/StateOptions.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/StateOptions.ts#L35) |
| <a id="stateroots"></a> `stateRoots?` | `public` | [`StateRoots`](StateRoots.md) | - | [tevm-monorepo/packages/state/src/state-types/StateOptions.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/StateOptions.ts#L31) |
| <a id="storagecache"></a> `storageCache?` | `readonly` | [`StorageCache`](../classes/StorageCache.md) | Optionally configure and pass in your own StorageCache | [tevm-monorepo/packages/state/src/state-types/StateOptions.ts:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/state-types/StateOptions.ts#L47) |
