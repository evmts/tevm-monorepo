---
editUrl: false
next: false
prev: false
title: "encodeFunctionResult"
---

> **encodeFunctionResult**\<`abi`, `functionName`\>(`parameters`): `EncodeFunctionResultReturnType`

## Type parameters

▪ **abi** extends readonly `unknown`[] \| `Abi`

▪ **functionName** extends `undefined` \| `string` = `undefined`

## Parameters

▪ **parameters**: `EncodeFunctionResultParameters`\<`abi`, `functionName`, `abi` extends `Abi` ? `Abi` extends `abi` ? `true` : [`Extract`\<`abi`[`number`], `object`\>] extends [`never`] ? `false` : `true` : `true`, [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`, `AbiStateMutability`\>\>

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/utils/abi/encodeFunctionResult.d.ts:21

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)