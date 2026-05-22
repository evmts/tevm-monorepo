[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / JsonRpcSimulateV2BlockResult

# Type Alias: JsonRpcSimulateV2BlockResult

> **JsonRpcSimulateV2BlockResult** = `object`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:541](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L541)

JSON-RPC response block result for eth_simulateV2 (extends V1)

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="basefeepergas"></a> `baseFeePerGas?` | `Hex` | [packages/actions/src/eth/EthJsonRpcResponse.ts:547](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L547) |
| <a id="calls"></a> `calls` | [`JsonRpcSimulateV2CallResult`](JsonRpcSimulateV2CallResult.md)[] | [packages/actions/src/eth/EthJsonRpcResponse.ts:549](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L549) |
| <a id="feerecipient"></a> `feeRecipient?` | `Address` | [packages/actions/src/eth/EthJsonRpcResponse.ts:548](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L548) |
| <a id="gaslimit"></a> `gasLimit` | `Hex` | [packages/actions/src/eth/EthJsonRpcResponse.ts:545](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L545) |
| <a id="gasused"></a> `gasUsed` | `Hex` | [packages/actions/src/eth/EthJsonRpcResponse.ts:546](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L546) |
| <a id="hash"></a> `hash` | `Hex` | [packages/actions/src/eth/EthJsonRpcResponse.ts:543](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L543) |
| <a id="number"></a> `number` | `Hex` | [packages/actions/src/eth/EthJsonRpcResponse.ts:542](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L542) |
| <a id="timestamp"></a> `timestamp` | `Hex` | [packages/actions/src/eth/EthJsonRpcResponse.ts:544](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L544) |
