[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / JsonRpcSimulateV2BlockResult

# Type Alias: JsonRpcSimulateV2BlockResult

> **JsonRpcSimulateV2BlockResult** = `object`

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:348

JSON-RPC response block result for eth_simulateV2 (extends V1)

## Properties

### baseFeePerGas?

> `optional` **baseFeePerGas**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:354

***

### calls

> **calls**: [`JsonRpcSimulateV2CallResult`](JsonRpcSimulateV2CallResult.md)[]

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:356

***

### feeRecipient?

> `optional` **feeRecipient**: [`Address`](../../index/type-aliases/Address.md)

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:355

***

### gasLimit

> **gasLimit**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:352

***

### gasUsed

> **gasUsed**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:353

***

### hash

> **hash**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:350

***

### number

> **number**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:349

***

### timestamp

> **timestamp**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:351
