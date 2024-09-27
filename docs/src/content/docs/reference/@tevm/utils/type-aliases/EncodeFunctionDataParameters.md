---
editUrl: false
next: false
prev: false
title: "EncodeFunctionDataParameters"
---

> **EncodeFunctionDataParameters**\<`abi`, `functionName`, `hasFunctions`, `allArgs`, `allFunctionNames`\>: `object` & `UnionEvaluate`\<`IsNarrowable`\<`abi`, `Abi`\> *extends* `true` ? `abi`\[`"length"`\] *extends* `1` ? `object` : `object` : `object`\> & `UnionEvaluate`\<readonly [] *extends* `allArgs` ? `object` : `object`\> & `hasFunctions` *extends* `true` ? `unknown` : `never`

## Type declaration

### abi

> **abi**: `abi`

## Type Parameters

• **abi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

• **functionName** *extends* [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\> \| [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `undefined` = [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\>

• **hasFunctions** = `abi` *extends* `Abi` ? `Abi` *extends* `abi` ? `true` : [`ExtractAbiFunctions`\<`abi`\>] *extends* [`never`] ? `false` : `true` : `true`

• **allArgs** = `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\> ? `functionName` : [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\>\>

• **allFunctionNames** = [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\>

## Defined in

node\_modules/.pnpm/viem@2.21.1\_bufferutil@4.0.8\_typescript@5.6.2\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/abi/encodeFunctionData.d.ts:12
