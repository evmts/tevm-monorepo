[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / JsonRpcSimulateV2BlockResult

# Type Alias: JsonRpcSimulateV2BlockResult

> **JsonRpcSimulateV2BlockResult** = `object`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:541](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L541)

JSON-RPC response block result for eth_simulateV2 (extends V1)

## Properties

### baseFeePerGas?

> `optional` **baseFeePerGas**: `Hex`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:547](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L547)

***

### calls

> **calls**: [`JsonRpcSimulateV2CallResult`](JsonRpcSimulateV2CallResult.md)[]

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:549](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L549)

***

### feeRecipient?

> `optional` **feeRecipient**: `Address`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:548](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L548)

***

### gasLimit

> **gasLimit**: `Hex`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:545](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L545)

***

### gasUsed

> **gasUsed**: `Hex`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:546](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L546)

***

### hash

> **hash**: `Hex`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:543](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L543)

***

### number

> **number**: `Hex`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:542](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L542)

***

### timestamp

> **timestamp**: `Hex`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:544](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L544)
