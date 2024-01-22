**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > encodeFunctionData

# Function: encodeFunctionData()

> **encodeFunctionData**\<`abi`, `functionName`\>(`parameters`): `EncodeFunctionDataReturnType`

## Type parameters

▪ **abi** extends [`Abi`](../type-aliases/Abi.md) \| readonly `unknown`[]

▪ **functionName** extends `undefined` \| `string` = `undefined`

## Parameters

▪ **parameters**: `EncodeFunctionDataParameters`\<`abi`, `functionName`, `abi` extends [`Abi`](../type-aliases/Abi.md) ? [`Abi`](../type-aliases/Abi.md) extends `abi` ? `true` : [`Extract`\<`abi`[`number`], `object`\>] extends [`never`] ? `false` : `true` : `true`, `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends `ContractFunctionName`\<`abi`, `AbiStateMutability`\> ? `functionName` : `ContractFunctionName`\<`abi`, `AbiStateMutability`\>\>, `ContractFunctionName`\<`abi`, `AbiStateMutability`\>\>

## Source

node\_modules/.pnpm/viem@2.4.0\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/utils/abi/encodeFunctionData.d.ts:27

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
