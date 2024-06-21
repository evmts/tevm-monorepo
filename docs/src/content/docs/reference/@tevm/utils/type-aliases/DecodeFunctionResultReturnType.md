---
editUrl: false
next: false
prev: false
title: "DecodeFunctionResultReturnType"
---

> **DecodeFunctionResultReturnType**\<`abi`, `functionName`, `args`\>: `ContractFunctionReturnType`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\> ? `functionName` : [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\>, `args`\>

## Type parameters

• **abi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

• **functionName** *extends* [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\> \| `undefined` = [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\>

• **args** *extends* `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\> ? `functionName` : [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\>\> = `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` *extends* [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\> ? `functionName` : [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\>\>

## Source

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.5.2\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/abi/decodeFunctionResult.d.ts:23
