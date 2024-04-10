**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > defineCall

# Function: defineCall()

> **defineCall**\<`TAbi`\>(`abi`, `handlers`): (`__namedParameters`) => `Promise`\<`ExecResult`\>

## Type parameters

▪ **TAbi** extends [`Abi`](../type-aliases/Abi.md)

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
> packages/precompiles/dist/index.d.ts:112
>

## Source

packages/precompiles/dist/index.d.ts:112

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
