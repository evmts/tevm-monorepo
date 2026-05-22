[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthSimulateV1Params

# Type Alias: EthSimulateV1Params

> **EthSimulateV1Params** = `object`

Based on the JSON-RPC request for `eth_simulateV1` procedure
Allows simulation of multiple transactions across multiple blocks with state overrides

## Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="blockstatecalls"></a> `blockStateCalls` | `readonly` | readonly [`EthSimulateV1BlockStateCall`](EthSimulateV1BlockStateCall.md)[] | Array of block state calls to simulate. Each block can have its own state overrides and multiple calls. |
| <a id="blocktag"></a> `blockTag?` | `readonly` | [`BlockParam`](../../index/type-aliases/BlockParam.md) | The block number or tag to execute the simulation against |
| <a id="returnfulltransactions"></a> `returnFullTransactions?` | `readonly` | `boolean` | Whether to return full transaction objects in the response |
| <a id="tracetransfers"></a> `traceTransfers?` | `readonly` | `boolean` | Whether to trace ETH transfers |
| <a id="validation"></a> `validation?` | `readonly` | `boolean` | Whether to validate transactions (check signatures, nonces, etc.) |
