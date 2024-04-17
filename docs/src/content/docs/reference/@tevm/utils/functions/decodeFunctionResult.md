---
editUrl: false
next: false
prev: false
title: "decodeFunctionResult"
---

> **decodeFunctionResult**\<`abi`, `functionName`, `args`\>(`parameters`): [`DecodeFunctionResultReturnType`](/reference/type-aliases/decodefunctionresultreturntype/)\<`abi`, `functionName`, `args`\>

## Type parameters

• **abi** extends readonly `unknown`[] \| `Abi`

• **functionName** extends `undefined` \| `string` = `undefined`

• **args** extends `unknown` = `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](/reference/type-aliases/contractfunctionname/)\<`abi`\> ? `functionName`\<`functionName`\> : [`ContractFunctionName`](/reference/type-aliases/contractfunctionname/)\<`abi`\>\>

## Parameters

• **parameters**: `DecodeFunctionResultParameters`\<`abi`, `functionName`, `args`, `abi` extends `Abi` ? `Abi` extends `abi`\<`abi`\> ? `true` : [`Extract`\<`abi`\<`abi`\>\[`number`\], `object`\>] extends [`never`] ? `false` : `true` : `true`, `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](/reference/type-aliases/contractfunctionname/)\<`abi`, `AbiStateMutability`\> ? `functionName`\<`functionName`\> : [`ContractFunctionName`](/reference/type-aliases/contractfunctionname/)\<`abi`, `AbiStateMutability`\>\>, [`ContractFunctionName`](/reference/type-aliases/contractfunctionname/)\<`abi`, `AbiStateMutability`\>\>

## Returns

[`DecodeFunctionResultReturnType`](/reference/type-aliases/decodefunctionresultreturntype/)\<`abi`, `functionName`, `args`\>

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5/node\_modules/viem/\_types/utils/abi/decodeFunctionResult.d.ts:25
