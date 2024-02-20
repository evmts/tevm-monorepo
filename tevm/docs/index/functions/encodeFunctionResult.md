**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > encodeFunctionResult

# Function: encodeFunctionResult()

> **encodeFunctionResult**\<`abi`, `functionName`\>(`parameters`): `EncodeFunctionResultReturnType`

## Type parameters

▪ **abi** extends [`Abi`](../type-aliases/Abi.md) \| readonly `unknown`[]

▪ **functionName** extends `undefined` \| `string` = `undefined`

## Parameters

▪ **parameters**: `EncodeFunctionResultParameters`\<`abi`, `functionName`, `abi` extends [`Abi`](../type-aliases/Abi.md) ? [`Abi`](../type-aliases/Abi.md) extends `abi` ? `true` : [`Extract`\<`abi`[`number`], `object`\>] extends [`never`] ? `false` : `true` : `true`, [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`, `AbiStateMutability`\>\>

## Source

node\_modules/.pnpm/viem@2.7.9\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/utils/abi/encodeFunctionResult.d.ts:21

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
