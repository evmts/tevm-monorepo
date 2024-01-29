**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > defineCall

# Function: defineCall()

> **defineCall**\<`TAbi`\>(`abi`, `handlers`): (`__namedParameters`) => `Promise`\<`object` \| `object`\>

## Type parameters

▪ **TAbi** extends `Abi`

## Parameters

▪ **abi**: `TAbi`

▪ **handlers**: `{ [TFunctionName in string]: Handler<TAbi, TFunctionName> }`

## Returns

> > (`__namedParameters`): `Promise`\<`object` \| `object`\>
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
> packages/precompiles/types/src/defineCall.d.ts:11
>

## Source

packages/precompiles/types/src/defineCall.d.ts:11

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
