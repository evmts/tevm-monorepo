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
> [precompiles/src/defineCall.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/defineCall.ts#L27)
>

## Source

[precompiles/src/defineCall.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/defineCall.ts#L21)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
