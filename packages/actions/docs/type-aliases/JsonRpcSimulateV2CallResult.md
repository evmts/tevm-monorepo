[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / JsonRpcSimulateV2CallResult

# Type Alias: JsonRpcSimulateV2CallResult

> **JsonRpcSimulateV2CallResult** = [`JsonRpcSimulateCallResult`](JsonRpcSimulateCallResult.md) & `object`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:529](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L529)

JSON-RPC response call result for eth_simulateV2 (extends V1)

## Type Declaration

### contractCreated?

> `optional` **contractCreated**: [`JsonRpcContractCreationEvent`](JsonRpcContractCreationEvent.md)

Contract creation event if a contract was deployed

### estimatedGas?

> `optional` **estimatedGas**: `Hex`

Estimated gas if gas estimation was requested

### trace?

> `optional` **trace**: [`JsonRpcCallTrace`](JsonRpcCallTrace.md)

Call trace for debugging
