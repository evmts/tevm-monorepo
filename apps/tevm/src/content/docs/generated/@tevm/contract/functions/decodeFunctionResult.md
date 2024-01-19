---
editUrl: false
next: false
prev: false
title: "decodeFunctionResult"
---

> **decodeFunctionResult**\<`abi`, `functionName`, `args`\>(`parameters`): `DecodeFunctionResultReturnType`\<`abi`, `functionName`, `args`\>

## Type parameters

▪ **abi** extends readonly `unknown`[] \| `Abi`

▪ **functionName** extends `undefined` \| `string` = `undefined`

▪ **args** extends `unknown` = `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends `ContractFunctionName`\<`abi`\> ? `functionName` : `ContractFunctionName`\<`abi`\>\>

## Parameters

▪ **parameters**: `DecodeFunctionResultParameters`\<`abi`, `functionName`, `args`, `abi` extends `Abi` ? `Abi` extends `abi` ? `true` : [`Extract`\<`abi`[`number`], `object`\>] extends [`never`] ? `false` : `true` : `true`, `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends `ContractFunctionName`\<`abi`, `AbiStateMutability`\> ? `functionName` : `ContractFunctionName`\<`abi`, `AbiStateMutability`\>\>, `ContractFunctionName`\<`abi`, `AbiStateMutability`\>\>

## Source

node\_modules/.pnpm/viem@2.0.2\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/utils/abi/decodeFunctionResult.d.ts:25

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
