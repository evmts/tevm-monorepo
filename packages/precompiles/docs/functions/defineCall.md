[**@tevm/precompiles**](../README.md)

***

[@tevm/precompiles](../globals.md) / defineCall

# Function: defineCall()

> **defineCall**\<`TAbi`\>(`abi`, `handlers`): (`__namedParameters`) => `Promise`\<`ExecResult`\>

Defined in: [defineCall.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/defineCall.ts#L19)

## Type Parameters

• **TAbi** *extends* `Abi`

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

`Promise`\<`ExecResult`\>
