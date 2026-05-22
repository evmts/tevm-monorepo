[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / JsonRpcCallTrace

# Type Alias: JsonRpcCallTrace

> **JsonRpcCallTrace** = `object`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:503](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L503)

JSON-RPC call trace for eth_simulateV2

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="calls"></a> `calls?` | `JsonRpcCallTrace`[] | Sub-calls | [packages/actions/src/eth/EthJsonRpcResponse.ts:523](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L523) |
| <a id="error"></a> `error?` | `string` | Error message if call failed | [packages/actions/src/eth/EthJsonRpcResponse.ts:521](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L521) |
| <a id="from"></a> `from` | `Address` | Sender address | [packages/actions/src/eth/EthJsonRpcResponse.ts:507](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L507) |
| <a id="gas"></a> `gas` | `Hex` | Gas provided | [packages/actions/src/eth/EthJsonRpcResponse.ts:513](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L513) |
| <a id="gasused"></a> `gasUsed` | `Hex` | Gas used | [packages/actions/src/eth/EthJsonRpcResponse.ts:515](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L515) |
| <a id="input"></a> `input` | `Hex` | Input data | [packages/actions/src/eth/EthJsonRpcResponse.ts:517](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L517) |
| <a id="output"></a> `output` | `Hex` | Output data | [packages/actions/src/eth/EthJsonRpcResponse.ts:519](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L519) |
| <a id="to"></a> `to?` | `Address` | Recipient or created contract address | [packages/actions/src/eth/EthJsonRpcResponse.ts:509](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L509) |
| <a id="type"></a> `type` | `string` | Call type (CALL, DELEGATECALL, STATICCALL, CREATE, CREATE2) | [packages/actions/src/eth/EthJsonRpcResponse.ts:505](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L505) |
| <a id="value"></a> `value?` | `Hex` | Value transferred | [packages/actions/src/eth/EthJsonRpcResponse.ts:511](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L511) |
