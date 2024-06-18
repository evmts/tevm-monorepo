[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / defineCall

# Function: defineCall()

> **defineCall**\<`TAbi`\>(`abi`, `handlers`): (`__namedParameters`) => `Promise`\<`ExecResult`\>

## Type parameters

• **TAbi** *extends* [`Abi`](../type-aliases/Abi.md)

## Parameters

• **abi**: `TAbi`

• **handlers**: `{ [TFunctionName in string]: Handler<TAbi, TFunctionName> }`

## Returns

`Function`

### Parameters

• **\_\_namedParameters**

• **\_\_namedParameters.data**: \`0x$\{string\}\`

• **\_\_namedParameters.gasLimit**: `bigint`

### Returns

`Promise`\<`ExecResult`\>

## Source

packages/precompiles/dist/index.d.ts:115
