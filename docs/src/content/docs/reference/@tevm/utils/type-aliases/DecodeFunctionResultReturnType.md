---
editUrl: false
next: false
prev: false
title: "DecodeFunctionResultReturnType"
---

> **DecodeFunctionResultReturnType**\<`abi`, `functionName`, `args`\>: `ContractFunctionReturnType`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\> ? `functionName` : [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\>, `args`\>

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `abi` extends [`Abi`](/reference/tevm/utils/type-aliases/abi/) \| readonly `unknown`[] | [`Abi`](/reference/tevm/utils/type-aliases/abi/) |
| `functionName` extends [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\> \| `undefined` | [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\> |
| `args` extends `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\> ? `functionName` : [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\>\> | `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\> ? `functionName` : [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\>\> |

## Source

node\_modules/.pnpm/viem@2.7.9\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/utils/abi/decodeFunctionResult.d.ts:23

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
