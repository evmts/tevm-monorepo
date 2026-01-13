[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / JsonRpcSimulateCallResult

# Type Alias: JsonRpcSimulateCallResult

> **JsonRpcSimulateCallResult** = `object`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:455](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L455)

JSON-RPC response call result for eth_simulateV1

## Properties

### error?

> `optional` **error**: `object`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:460](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L460)

#### code

> **code**: `number`

#### data?

> `optional` **data**: `Hex`

#### message

> **message**: `string`

***

### gasUsed

> **gasUsed**: `Hex`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:458](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L458)

***

### logs

> **logs**: `SerializeToJson`\<[`FilterLog`](FilterLog.md)\>[]

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:457](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L457)

***

### returnData

> **returnData**: `Hex`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:456](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L456)

***

### status

> **status**: `Hex`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:459](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L459)
