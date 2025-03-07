[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / defineCall

# Function: defineCall()

> **defineCall**\<`TAbi`\>(`abi`, `handlers`): (`__namedParameters`) => `Promise`\<[`ExecResult`](../../evm/interfaces/ExecResult.md)\>

Defined in: packages/precompiles/dist/index.d.ts:121

## Type Parameters

• **TAbi** *extends* [`Abi`](../type-aliases/Abi.md)

## Parameters

### abi

`TAbi`

### handlers

`{ [TFunctionName in string]: Handler<TAbi, TFunctionName> }`

## Returns

`Function`

### Parameters

#### \_\_namedParameters

##### data

`` `0x${string}` ``

##### gasLimit

`bigint`

### Returns

`Promise`\<[`ExecResult`](../../evm/interfaces/ExecResult.md)\>
