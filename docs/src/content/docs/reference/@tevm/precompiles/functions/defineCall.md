---
editUrl: false
next: false
prev: false
title: "defineCall"
---

> **defineCall**\<`TAbi`\>(`abi`, `handlers`): (`__namedParameters`) => `Promise`\<[`ExecResult`](/reference/evm/interfaces/execresult/)\>

## Type parameters

• **TAbi** extends [`Abi`](/reference/utils/type-aliases/abi/)

## Parameters

• **abi**: `TAbi`

• **handlers**: `{ [TFunctionName in string]: Handler<TAbi, TFunctionName> }`

## Returns

`Function`

> ### Parameters
>
> • **\_\_namedParameters**
>
> • **\_\_namedParameters\.data**: ```0x${string}```
>
> • **\_\_namedParameters\.gasLimit**: `bigint`
>
> ### Returns
>
> `Promise`\<[`ExecResult`](/reference/evm/interfaces/execresult/)\>
>

## Source

[precompiles/src/defineCall.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/defineCall.ts#L26)
