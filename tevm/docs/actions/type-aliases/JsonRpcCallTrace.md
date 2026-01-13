[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / JsonRpcCallTrace

# Type Alias: JsonRpcCallTrace

> **JsonRpcCallTrace** = `object`

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:312

JSON-RPC call trace for eth_simulateV2

## Properties

### calls?

> `optional` **calls**: `JsonRpcCallTrace`[]

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:332

Sub-calls

***

### error?

> `optional` **error**: `string`

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:330

Error message if call failed

***

### from

> **from**: [`Address`](../../index/type-aliases/Address.md)

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:316

Sender address

***

### gas

> **gas**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:322

Gas provided

***

### gasUsed

> **gasUsed**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:324

Gas used

***

### input

> **input**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:326

Input data

***

### output

> **output**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:328

Output data

***

### to?

> `optional` **to**: [`Address`](../../index/type-aliases/Address.md)

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:318

Recipient or created contract address

***

### type

> **type**: `string`

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:314

Call type (CALL, DELEGATECALL, STATICCALL, CREATE, CREATE2)

***

### value?

> `optional` **value**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:320

Value transferred
