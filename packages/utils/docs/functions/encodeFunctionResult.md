**@tevm/utils** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > encodeFunctionResult

# Function: encodeFunctionResult()

> **encodeFunctionResult**\<`abi`, `functionName`\>(`parameters`): `EncodeFunctionResultReturnType`

## Type parameters

▪ **abi** extends readonly `unknown`[] \| `Abi`

▪ **functionName** extends `undefined` \| `string` = `undefined`

## Parameters

▪ **parameters**: `EncodeFunctionResultParameters`\<`abi`, `functionName`, `abi` extends `Abi` ? `Abi` extends `abi`\<`abi`\> ? `true` : [`Extract`\<`abi`\<`abi`\>[`number`], `object`\>] extends [`never`] ? `false` : `true` : `true`, [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`, `AbiStateMutability`\>\>

## Source

node\_modules/.pnpm/viem@2.9.23\_typescript@5.4.5\_zod@3.22.5/node\_modules/viem/\_types/utils/abi/encodeFunctionResult.d.ts:21

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
