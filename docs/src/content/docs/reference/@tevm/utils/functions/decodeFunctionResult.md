---
editUrl: false
next: false
prev: false
title: "decodeFunctionResult"
---

> **decodeFunctionResult**\<`abi`, `functionName`, `args`\>(`parameters`): [`DecodeFunctionResultReturnType`](/reference/tevm/utils/type-aliases/decodefunctionresultreturntype/)\<`abi`, `functionName`, `args`\>

## Type parameters

▪ **abi** extends [`Abi`](/reference/tevm/utils/type-aliases/abi/) \| readonly `unknown`[]

▪ **functionName** extends `undefined` \| `string` = `undefined`

▪ **args** extends `unknown` = `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\> ? `functionName` : [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\>\>

## Parameters

▪ **parameters**: `DecodeFunctionResultParameters`\<`abi`, `functionName`, `args`, `abi` extends [`Abi`](/reference/tevm/utils/type-aliases/abi/) ? [`Abi`](/reference/tevm/utils/type-aliases/abi/) extends `abi` ? `true` : [`Extract`\<`abi`[`number`], `object`\>] extends [`never`] ? `false` : `true` : `true`, `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`, `AbiStateMutability`\> ? `functionName` : [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`, `AbiStateMutability`\>\>, [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`, `AbiStateMutability`\>\>

## Source

node\_modules/.pnpm/viem@2.7.9\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/utils/abi/decodeFunctionResult.d.ts:25

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
