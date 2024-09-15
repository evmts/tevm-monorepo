---
editUrl: false
next: false
prev: false
title: "encodeFunctionData"
---

> **encodeFunctionData**\<`abi`, `functionName`\>(`parameters`): `EncodeFunctionDataReturnType`

## Type Parameters

• **abi** *extends* `Abi` \| readonly `unknown`[]

• **functionName** *extends* `undefined` \| `string` = `undefined`

## Parameters

• **parameters**: [`EncodeFunctionDataParameters`](/reference/tevm/utils/type-aliases/encodefunctiondataparameters/)\<`abi`, `functionName`, `abi` *extends* `Abi` ? `Abi` *extends* `abi`\<`abi`\> ? `true` : [`Extract`\<`abi`\<`abi`\>\[`number`\], `object`\>] *extends* [`never`] ? `false` : `true` : `true`, `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`, `AbiStateMutability`\> ? `functionName`\<`functionName`\> : [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`, `AbiStateMutability`\>\>, [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`, `AbiStateMutability`\>\>

## Returns

`EncodeFunctionDataReturnType`

## Defined in

node\_modules/.pnpm/viem@2.21.7\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/abi/encodeFunctionData.d.ts:27
