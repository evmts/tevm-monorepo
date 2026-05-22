[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSimulateV2Params

# Type Alias: EthSimulateV2Params

> **EthSimulateV2Params** = `object`

Defined in: [packages/actions/src/eth/EthParams.ts:523](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L523)

Based on the JSON-RPC request for `eth_simulateV2` procedure
Extends V1 with additional features:
- Contract creation detection (emits events for deployed contracts)
- Stack traces for debugging
- Dynamic gas estimation
- Enhanced tracing options

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="blockstatecalls"></a> `blockStateCalls` | `readonly` | readonly [`EthSimulateV2BlockStateCall`](EthSimulateV2BlockStateCall.md)[] | Array of block state calls to simulate. Each block can have its own state overrides and multiple calls. | [packages/actions/src/eth/EthParams.ts:528](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L528) |
| <a id="blocktag"></a> `blockTag?` | `readonly` | [`BlockParam`](BlockParam.md) | The block number or tag to execute the simulation against | [packages/actions/src/eth/EthParams.ts:544](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L544) |
| <a id="includecalltraces"></a> `includeCallTraces?` | `readonly` | `boolean` | Whether to include call traces in the response. V2 feature: provides detailed execution traces for debugging. | [packages/actions/src/eth/EthParams.ts:554](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L554) |
| <a id="includecontractcreationevents"></a> `includeContractCreationEvents?` | `readonly` | `boolean` | Whether to include contract creation events in the logs. V2 feature: emits a synthetic log when contracts are deployed. | [packages/actions/src/eth/EthParams.ts:549](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L549) |
| <a id="returnfulltransactions"></a> `returnFullTransactions?` | `readonly` | `boolean` | Whether to return full transaction objects in the response | [packages/actions/src/eth/EthParams.ts:540](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L540) |
| <a id="tracetransfers"></a> `traceTransfers?` | `readonly` | `boolean` | Whether to trace ETH transfers (adds Transfer logs for native ETH) | [packages/actions/src/eth/EthParams.ts:532](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L532) |
| <a id="validation"></a> `validation?` | `readonly` | `boolean` | Whether to validate transactions (check signatures, nonces, etc.) | [packages/actions/src/eth/EthParams.ts:536](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L536) |
