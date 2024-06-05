---
editUrl: false
next: false
prev: false
title: "decodeFunctionResult"
---

> **decodeFunctionResult**\<`abi`, `functionName`, `args`\>(`parameters`): [`DecodeFunctionResultReturnType`](/reference/tevm/utils/type-aliases/decodefunctionresultreturntype/)\<`abi`, `functionName`, `args`\>

## Type parameters

• **abi** *extends* `Abi` \| readonly `unknown`[]

• **functionName** *extends* `undefined` \| `string` = `undefined`

• **args** *extends* `unknown` = `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\> ? `functionName`\<`functionName`\> : [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\>\>

## Parameters

• **parameters**: `DecodeFunctionResultParameters`\<`abi`, `functionName`, `args`, `abi` *extends* `Abi` ? `Abi` *extends* `abi`\<`abi`\> ? `true` : [`Extract`\<`abi`\<`abi`\>\[`number`\], `object`\>] *extends* [`never`] ? `false` : `true` : `true`, `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`, `AbiStateMutability`\> ? `functionName`\<`functionName`\> : [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`, `AbiStateMutability`\>\>, [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`, `AbiStateMutability`\>\>

## Returns

[`DecodeFunctionResultReturnType`](/reference/tevm/utils/type-aliases/decodefunctionresultreturntype/)\<`abi`, `functionName`, `args`\>

## Source

node\_modules/.pnpm/viem@2.13.6\_typescript@5.4.5\_zod@3.23.8/node\_modules/viem/\_types/utils/abi/decodeFunctionResult.d.ts:25
