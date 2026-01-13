[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSimulateV2JsonRpcRequest

# Type Alias: EthSimulateV2JsonRpcRequest

> **EthSimulateV2JsonRpcRequest** = `JsonRpcRequest`\<`"eth_simulateV2"`, readonly \[`object`, `BlockTag` \| `Hex`\]\>

Defined in: [packages/actions/src/eth/EthJsonRpcRequest.ts:433](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L433)

JSON-RPC request for `eth_simulateV2` procedure
Extends V1 with additional options for contract creation detection and call tracing
