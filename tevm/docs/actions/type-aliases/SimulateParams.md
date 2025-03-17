[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / SimulateParams

# Type Alias: SimulateParams

> **SimulateParams**: `object`

Defined in: packages/actions/types/eth/ethSimulateV1HandlerType.d.ts:91

## Type declaration

### account?

> `optional` **account**: `` `0x${string}` ``

- The account to use as the default transaction sender and for asset tracking

### blockNumber?

> `optional` **blockNumber**: `` `0x${string}` `` \| `"earliest"` \| `"latest"` \| `"pending"` \| `"safe"` \| `"finalized"`

- Block to execute against

### blockOverrides?

> `optional` **blockOverrides**: [`BlockOverride`](BlockOverride.md)

- Block parameters to override

### blockStateCalls

> **blockStateCalls**: [`SimulateCallItem`](SimulateCallItem.md)[]

- Array of call items to execute

### stateOverrides?

> `optional` **stateOverrides**: [`StateOverride`](StateOverride.md)[]

- Array of state overrides to apply

### traceAssetChanges?

> `optional` **traceAssetChanges**: `boolean`

- Whether to track changes in asset balances
