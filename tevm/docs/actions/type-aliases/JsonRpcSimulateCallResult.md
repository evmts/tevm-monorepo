[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / JsonRpcSimulateCallResult

# Type Alias: JsonRpcSimulateCallResult

> **JsonRpcSimulateCallResult** = `object`

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:271

JSON-RPC response call result for eth_simulateV1

## Properties

### error?

> `optional` **error**: `object`

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:276

#### code

> **code**: `number`

#### data?

> `optional` **data**: [`Hex`](../../index/type-aliases/Hex.md)

#### message

> **message**: `string`

***

### gasUsed

> **gasUsed**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:274

***

### logs

> **logs**: `SerializeToJson`\<[`FilterLog`](FilterLog.md)\>[]

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:273

***

### returnData

> **returnData**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:272

***

### status

> **status**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:275
