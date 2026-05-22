[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthSimulateV2Params

# Type Alias: EthSimulateV2Params

> **EthSimulateV2Params** = `object`

Based on the JSON-RPC request for `eth_simulateV2` procedure
Extends V1 with additional features:
- Contract creation detection (emits events for deployed contracts)
- Stack traces for debugging
- Dynamic gas estimation
- Enhanced tracing options

## Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="blockstatecalls"></a> `blockStateCalls` | `readonly` | readonly [`EthSimulateV2BlockStateCall`](EthSimulateV2BlockStateCall.md)[] | Array of block state calls to simulate. Each block can have its own state overrides and multiple calls. |
| <a id="blocktag"></a> `blockTag?` | `readonly` | [`BlockParam`](../../index/type-aliases/BlockParam.md) | The block number or tag to execute the simulation against |
| <a id="includecalltraces"></a> `includeCallTraces?` | `readonly` | `boolean` | Whether to include call traces in the response. V2 feature: provides detailed execution traces for debugging. |
| <a id="includecontractcreationevents"></a> `includeContractCreationEvents?` | `readonly` | `boolean` | Whether to include contract creation events in the logs. V2 feature: emits a synthetic log when contracts are deployed. |
| <a id="returnfulltransactions"></a> `returnFullTransactions?` | `readonly` | `boolean` | Whether to return full transaction objects in the response |
| <a id="tracetransfers"></a> `traceTransfers?` | `readonly` | `boolean` | Whether to trace ETH transfers (adds Transfer logs for native ETH) |
| <a id="validation"></a> `validation?` | `readonly` | `boolean` | Whether to validate transactions (check signatures, nonces, etc.) |
