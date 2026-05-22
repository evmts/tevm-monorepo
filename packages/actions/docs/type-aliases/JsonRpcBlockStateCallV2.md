[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / JsonRpcBlockStateCallV2

# Type Alias: JsonRpcBlockStateCallV2

> **JsonRpcBlockStateCallV2** = `object`

Defined in: [packages/actions/src/eth/EthJsonRpcRequest.ts:431](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L431)

A block of calls for simulateV2 (uses V2 transactions)

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="blockoverrides"></a> `blockOverrides?` | [`JsonRpcBlockOverride`](JsonRpcBlockOverride.md) | [packages/actions/src/eth/EthJsonRpcRequest.ts:432](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L432) |
| <a id="calls"></a> `calls?` | [`JsonRpcSimulateV2Transaction`](JsonRpcSimulateV2Transaction.md)[] | [packages/actions/src/eth/EthJsonRpcRequest.ts:434](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L434) |
| <a id="stateoverrides"></a> `stateOverrides?` | [`JsonRpcStateOverride`](JsonRpcStateOverride.md) | [packages/actions/src/eth/EthJsonRpcRequest.ts:433](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L433) |
