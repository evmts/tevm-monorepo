[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / JsonRpcSimulateCallResult

# Type Alias: JsonRpcSimulateCallResult

> **JsonRpcSimulateCallResult** = `object`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:455](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L455)

JSON-RPC response call result for eth_simulateV1

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="error"></a> `error?` | `object` | [packages/actions/src/eth/EthJsonRpcResponse.ts:460](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L460) |
| `error.code` | `number` | [packages/actions/src/eth/EthJsonRpcResponse.ts:461](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L461) |
| `error.data?` | `Hex` | [packages/actions/src/eth/EthJsonRpcResponse.ts:463](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L463) |
| `error.message` | `string` | [packages/actions/src/eth/EthJsonRpcResponse.ts:462](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L462) |
| <a id="gasused"></a> `gasUsed` | `Hex` | [packages/actions/src/eth/EthJsonRpcResponse.ts:458](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L458) |
| <a id="logs"></a> `logs` | `SerializeToJson`\<[`FilterLog`](FilterLog.md)\>[] | [packages/actions/src/eth/EthJsonRpcResponse.ts:457](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L457) |
| <a id="returndata"></a> `returnData` | `Hex` | [packages/actions/src/eth/EthJsonRpcResponse.ts:456](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L456) |
| <a id="status"></a> `status` | `Hex` | [packages/actions/src/eth/EthJsonRpcResponse.ts:459](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L459) |
