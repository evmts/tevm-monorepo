[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthSimulateV2Params

# Type Alias: EthSimulateV2Params

> **EthSimulateV2Params** = `object`

Defined in: packages/actions/types/eth/EthParams.d.ts:484

Based on the JSON-RPC request for `eth_simulateV2` procedure
Extends V1 with additional features:
- Contract creation detection (emits events for deployed contracts)
- Stack traces for debugging
- Dynamic gas estimation
- Enhanced tracing options

## Properties

### blockStateCalls

> `readonly` **blockStateCalls**: readonly [`EthSimulateV2BlockStateCall`](EthSimulateV2BlockStateCall.md)[]

Defined in: packages/actions/types/eth/EthParams.d.ts:489

Array of block state calls to simulate. Each block can have its own
state overrides and multiple calls.

***

### blockTag?

> `readonly` `optional` **blockTag**: [`BlockParam`](../../index/type-aliases/BlockParam.md)

Defined in: packages/actions/types/eth/EthParams.d.ts:505

The block number or tag to execute the simulation against

***

### includeCallTraces?

> `readonly` `optional` **includeCallTraces**: `boolean`

Defined in: packages/actions/types/eth/EthParams.d.ts:515

Whether to include call traces in the response.
V2 feature: provides detailed execution traces for debugging.

***

### includeContractCreationEvents?

> `readonly` `optional` **includeContractCreationEvents**: `boolean`

Defined in: packages/actions/types/eth/EthParams.d.ts:510

Whether to include contract creation events in the logs.
V2 feature: emits a synthetic log when contracts are deployed.

***

### returnFullTransactions?

> `readonly` `optional` **returnFullTransactions**: `boolean`

Defined in: packages/actions/types/eth/EthParams.d.ts:501

Whether to return full transaction objects in the response

***

### traceTransfers?

> `readonly` `optional` **traceTransfers**: `boolean`

Defined in: packages/actions/types/eth/EthParams.d.ts:493

Whether to trace ETH transfers (adds Transfer logs for native ETH)

***

### validation?

> `readonly` `optional` **validation**: `boolean`

Defined in: packages/actions/types/eth/EthParams.d.ts:497

Whether to validate transactions (check signatures, nonces, etc.)
