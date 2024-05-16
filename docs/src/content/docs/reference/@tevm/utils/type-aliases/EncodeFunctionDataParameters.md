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

## Type parameters

• **abi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

• **functionName** *extends* [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\> \| [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `undefined` = [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\>

• **hasFunctions** = `abi` *extends* `Abi` ? `Abi` *extends* `abi` ? `true` : [`ExtractAbiFunctions`\<`abi`\>] *extends* [`never`] ? `false` : `true` : `true`

• **allArgs** = `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\> ? `functionName` : [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\>\>

• **allFunctionNames** = [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\>

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5\_zod@3.23.8/node\_modules/viem/\_types/utils/abi/encodeFunctionData.d.ts:12
