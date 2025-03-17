[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSimulateV1JsonRpcRequest

# Type Alias: EthSimulateV1JsonRpcRequest

> **EthSimulateV1JsonRpcRequest**: `JsonRpcRequest`\<`"eth_simulateV1"`, readonly \[\{ `account`: `Address`; `blockNumber`: `BlockTag` \| `Hex`; `blockOverrides`: \{ `baseFeePerGas`: `Hex`; `coinbase`: `Address`; `difficulty`: `Hex`; `gasLimit`: `Hex`; `number`: `Hex`; `timestamp`: `Hex`; \}; `blockStateCalls`: `object`[]; `stateOverrides`: `object`[]; `traceAssetChanges`: `boolean`; \}\]\>

Defined in: [packages/actions/src/eth/EthJsonRpcRequest.ts:310](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L310)

JSON-RPC request for the `eth_simulateV1` procedure
Simulates a series of transactions at a specific block height with optional state overrides
