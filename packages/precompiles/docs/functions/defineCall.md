[**@tevm/precompiles**](../README.md) • **Docs**

***

[@tevm/precompiles](../globals.md) / defineCall

# Function: defineCall()

> **defineCall**\<`TAbi`\>(`abi`, `handlers`): (`__namedParameters`) => `Promise`\<`ExecResult`\>

## Type parameters

• **TAbi** *extends* `Abi`

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

[defineCall.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/defineCall.ts#L21)
