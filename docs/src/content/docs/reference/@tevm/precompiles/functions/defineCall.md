---
editUrl: false
next: false
prev: false
title: "defineCall"
---

> **defineCall**\<`TAbi`\>(`abi`, `handlers`): (`__namedParameters`) => `Promise`\<[`ExecResult`](/reference/tevm/evm/interfaces/execresult/)\>

## Type Parameters

• **TAbi** *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/)

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

`Promise`\<[`ExecResult`](/reference/tevm/evm/interfaces/execresult/)\>

## Defined in

[defineCall.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/defineCall.ts#L19)
