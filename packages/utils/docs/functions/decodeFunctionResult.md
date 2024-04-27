**@tevm/utils** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > decodeFunctionResult

# Function: decodeFunctionResult()

> **decodeFunctionResult**\<`abi`, `functionName`, `args`\>(`parameters`): [`DecodeFunctionResultReturnType`](../type-aliases/DecodeFunctionResultReturnType.md)\<`abi`, `functionName`, `args`\>

## Type parameters

▪ **abi** extends readonly `unknown`[] \| `Abi`

▪ **functionName** extends `undefined` \| `string` = `undefined`

▪ **args** extends `unknown` = `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`\> ? `functionName`\<`functionName`\> : [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`\>\>

## Parameters

▪ **parameters**: `DecodeFunctionResultParameters`\<`abi`, `functionName`, `args`, `abi` extends `Abi` ? `Abi` extends `abi`\<`abi`\> ? `true` : [`Extract`\<`abi`\<`abi`\>[`number`], `object`\>] extends [`never`] ? `false` : `true` : `true`, `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`, `AbiStateMutability`\> ? `functionName`\<`functionName`\> : [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`, `AbiStateMutability`\>\>, [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`abi`, `AbiStateMutability`\>\>

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5\_zod@3.23.4/node\_modules/viem/\_types/utils/abi/decodeFunctionResult.d.ts:25

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
