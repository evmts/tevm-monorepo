[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / JsonRpcBlockStateCallV2

# Type Alias: JsonRpcBlockStateCallV2

> **JsonRpcBlockStateCallV2** = `object`

Defined in: [packages/actions/src/eth/EthJsonRpcRequest.ts:424](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L424)

A block of calls for simulateV2 (uses V2 transactions)

## Properties

### blockOverrides?

> `optional` **blockOverrides**: [`JsonRpcBlockOverride`](JsonRpcBlockOverride.md)

Defined in: [packages/actions/src/eth/EthJsonRpcRequest.ts:425](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L425)

***

### calls?

> `optional` **calls**: [`JsonRpcSimulateV2Transaction`](JsonRpcSimulateV2Transaction.md)[]

Defined in: [packages/actions/src/eth/EthJsonRpcRequest.ts:427](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L427)

***

### stateOverrides?

> `optional` **stateOverrides**: [`JsonRpcStateOverride`](JsonRpcStateOverride.md)

Defined in: [packages/actions/src/eth/EthJsonRpcRequest.ts:426](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcRequest.ts#L426)
