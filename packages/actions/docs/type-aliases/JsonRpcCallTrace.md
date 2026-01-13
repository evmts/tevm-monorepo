[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / JsonRpcCallTrace

# Type Alias: JsonRpcCallTrace

> **JsonRpcCallTrace** = `object`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:503](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L503)

JSON-RPC call trace for eth_simulateV2

## Properties

### calls?

> `optional` **calls**: `JsonRpcCallTrace`[]

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:523](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L523)

Sub-calls

***

### error?

> `optional` **error**: `string`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:521](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L521)

Error message if call failed

***

### from

> **from**: `Address`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:507](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L507)

Sender address

***

### gas

> **gas**: `Hex`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:513](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L513)

Gas provided

***

### gasUsed

> **gasUsed**: `Hex`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:515](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L515)

Gas used

***

### input

> **input**: `Hex`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:517](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L517)

Input data

***

### output

> **output**: `Hex`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:519](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L519)

Output data

***

### to?

> `optional` **to**: `Address`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:509](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L509)

Recipient or created contract address

***

### type

> **type**: `string`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:505](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L505)

Call type (CALL, DELEGATECALL, STATICCALL, CREATE, CREATE2)

***

### value?

> `optional` **value**: `Hex`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:511](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L511)

Value transferred
