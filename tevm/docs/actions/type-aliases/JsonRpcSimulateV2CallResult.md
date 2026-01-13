[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / JsonRpcSimulateV2CallResult

# Type Alias: JsonRpcSimulateV2CallResult

> **JsonRpcSimulateV2CallResult** = [`JsonRpcSimulateCallResult`](JsonRpcSimulateCallResult.md) & `object`

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:337

JSON-RPC response call result for eth_simulateV2 (extends V1)

## Type Declaration

### contractCreated?

> `optional` **contractCreated**: [`JsonRpcContractCreationEvent`](JsonRpcContractCreationEvent.md)

Contract creation event if a contract was deployed

### estimatedGas?

> `optional` **estimatedGas**: [`Hex`](../../index/type-aliases/Hex.md)

Estimated gas if gas estimation was requested

### trace?

> `optional` **trace**: [`JsonRpcCallTrace`](JsonRpcCallTrace.md)

Call trace for debugging
