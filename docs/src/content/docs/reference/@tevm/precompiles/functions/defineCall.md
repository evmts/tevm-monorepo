---
editUrl: false
next: false
prev: false
title: "defineCall"
---

> **defineCall**\<`TAbi`\>(`abi`, `handlers`): (`__namedParameters`) => `Promise`\<`ExecResult`\>

## Type parameters

▪ **TAbi** extends `Abi`

## Parameters

▪ **abi**: `TAbi`

▪ **handlers**: `{ [TFunctionName in string]: Handler<TAbi, TFunctionName> }`

## Returns

> > (`__namedParameters`): `Promise`\<`ExecResult`\>
>
> ### Parameters
>
> ▪ **\_\_namedParameters**: `object`
>
> ▪ **\_\_namedParameters.data**: \`0x${string}\`
>
> ▪ **\_\_namedParameters.gasLimit**: `bigint`
>
> ### Source
>
> [precompiles/src/defineCall.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/defineCall.ts#L35)
>

## Source

[precompiles/src/defineCall.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/defineCall.ts#L26)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
