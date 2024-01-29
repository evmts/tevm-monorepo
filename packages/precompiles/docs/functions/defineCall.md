**@tevm/precompiles** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > defineCall

# Function: defineCall()

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
> [precompiles/src/defineCall.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/defineCall.ts#L37)
>

## Source

[precompiles/src/defineCall.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/defineCall.ts#L28)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
