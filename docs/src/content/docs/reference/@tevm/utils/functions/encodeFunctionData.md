---
editUrl: false
next: false
prev: false
title: "encodeFunctionData"
---

> **encodeFunctionData**\<`abi`, `functionName`\>(`parameters`): `EncodeFunctionDataReturnType`

## Type parameters

• **abi** extends readonly `unknown`[] \| `Abi`

• **functionName** extends `undefined` \| `string` = `undefined`

## Parameters

• **parameters**: [`EncodeFunctionDataParameters`](/reference/type-aliases/encodefunctiondataparameters/)\<`abi`, `functionName`, `abi` extends `Abi` ? `Abi` extends `abi`\<`abi`\> ? `true` : [`Extract`\<`abi`\<`abi`\>\[`number`\], `object`\>] extends [`never`] ? `false` : `true` : `true`, `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](/reference/type-aliases/contractfunctionname/)\<`abi`, `AbiStateMutability`\> ? `functionName`\<`functionName`\> : [`ContractFunctionName`](/reference/type-aliases/contractfunctionname/)\<`abi`, `AbiStateMutability`\>\>, [`ContractFunctionName`](/reference/type-aliases/contractfunctionname/)\<`abi`, `AbiStateMutability`\>\>

## Returns

`EncodeFunctionDataReturnType`

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5/node\_modules/viem/\_types/utils/abi/encodeFunctionData.d.ts:27
