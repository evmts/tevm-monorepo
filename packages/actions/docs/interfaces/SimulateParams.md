[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / SimulateParams

# Interface: SimulateParams

Defined in: [packages/actions/src/eth/ethSimulateV1HandlerType.js:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1HandlerType.js#L39)

## Properties

### account?

> `optional` **account**: `` `0x${string}` ``

Defined in: [packages/actions/src/eth/ethSimulateV1HandlerType.js:40](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1HandlerType.js#L40)

The account to use as the default transaction sender and for asset tracking

***

### blockNumber?

> `optional` **blockNumber**: `` `0x${string}` `` \| `"latest"` \| `"earliest"` \| `"pending"` \| `"safe"` \| `"finalized"`

Defined in: [packages/actions/src/eth/ethSimulateV1HandlerType.js:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1HandlerType.js#L42)

Block to execute against

***

### blockOverrides?

> `optional` **blockOverrides**: [`BlockOverride`](BlockOverride.md)

Defined in: [packages/actions/src/eth/ethSimulateV1HandlerType.js:44](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1HandlerType.js#L44)

Block parameters to override

***

### blockStateCalls

> **blockStateCalls**: [`SimulateCallItem`](SimulateCallItem.md)[]

Defined in: [packages/actions/src/eth/ethSimulateV1HandlerType.js:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1HandlerType.js#L41)

Array of call items to execute

***

### stateOverrides?

> `optional` **stateOverrides**: [`StateOverride`](StateOverride.md)[]

Defined in: [packages/actions/src/eth/ethSimulateV1HandlerType.js:43](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1HandlerType.js#L43)

Array of state overrides to apply

***

### traceAssetChanges?

> `optional` **traceAssetChanges**: `boolean`

Defined in: [packages/actions/src/eth/ethSimulateV1HandlerType.js:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSimulateV1HandlerType.js#L45)

Whether to track changes in asset balances
