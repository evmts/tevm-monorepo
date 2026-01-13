[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSimulateV2Params

# Type Alias: EthSimulateV2Params

> **EthSimulateV2Params** = `object`

Defined in: [packages/actions/src/eth/EthParams.ts:516](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L516)

Based on the JSON-RPC request for `eth_simulateV2` procedure
Extends V1 with additional features:
- Contract creation detection (emits events for deployed contracts)
- Stack traces for debugging
- Dynamic gas estimation
- Enhanced tracing options

## Properties

### blockStateCalls

> `readonly` **blockStateCalls**: readonly [`EthSimulateV2BlockStateCall`](EthSimulateV2BlockStateCall.md)[]

Defined in: [packages/actions/src/eth/EthParams.ts:521](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L521)

Array of block state calls to simulate. Each block can have its own
state overrides and multiple calls.

***

### blockTag?

> `readonly` `optional` **blockTag**: [`BlockParam`](BlockParam.md)

Defined in: [packages/actions/src/eth/EthParams.ts:537](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L537)

The block number or tag to execute the simulation against

***

### includeCallTraces?

> `readonly` `optional` **includeCallTraces**: `boolean`

Defined in: [packages/actions/src/eth/EthParams.ts:547](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L547)

Whether to include call traces in the response.
V2 feature: provides detailed execution traces for debugging.

***

### includeContractCreationEvents?

> `readonly` `optional` **includeContractCreationEvents**: `boolean`

Defined in: [packages/actions/src/eth/EthParams.ts:542](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L542)

Whether to include contract creation events in the logs.
V2 feature: emits a synthetic log when contracts are deployed.

***

### returnFullTransactions?

> `readonly` `optional` **returnFullTransactions**: `boolean`

Defined in: [packages/actions/src/eth/EthParams.ts:533](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L533)

Whether to return full transaction objects in the response

***

### traceTransfers?

> `readonly` `optional` **traceTransfers**: `boolean`

Defined in: [packages/actions/src/eth/EthParams.ts:525](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L525)

Whether to trace ETH transfers (adds Transfer logs for native ETH)

***

### validation?

> `readonly` `optional` **validation**: `boolean`

Defined in: [packages/actions/src/eth/EthParams.ts:529](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L529)

Whether to validate transactions (check signatures, nonces, etc.)
