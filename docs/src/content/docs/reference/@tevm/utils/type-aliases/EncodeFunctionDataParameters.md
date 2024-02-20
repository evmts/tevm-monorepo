---
editUrl: false
next: false
prev: false
title: "EncodeFunctionDataParameters"
---

> **EncodeFunctionDataParameters**\<`abi`, `functionName`, `hasFunctions`, `allArgs`, `allFunctionNames`\>: `object` & `UnionEvaluate`\<`IsNarrowable`\<`abi`, [`Abi`](/reference/tevm/utils/type-aliases/abi/)\> extends `true` ? `abi`[`"length"`] extends `1` ? `object` : `object` : `object`\> & `UnionEvaluate`\<readonly [] extends `allArgs` ? `object` : `object`\> & `hasFunctions` extends `true` ? `unknown` : `never`

## Type declaration

### abi

> **abi**: `abi`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `abi` extends [`Abi`](/reference/tevm/utils/type-aliases/abi/) \| readonly `unknown`[] | [`Abi`](/reference/tevm/utils/type-aliases/abi/) |
| `functionName` extends [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\> \| `undefined` | [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\> |
| `hasFunctions` | `abi` extends [`Abi`](/reference/tevm/utils/type-aliases/abi/) ? [`Abi`](/reference/tevm/utils/type-aliases/abi/) extends `abi` ? `true` : [`ExtractAbiFunctions`\<`abi`\>] extends [`never`] ? `false` : `true` : `true` |
| `allArgs` | `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\> ? `functionName` : [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\>\> |
| `allFunctionNames` | [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`abi`\> |

## Source

node\_modules/.pnpm/viem@2.7.9\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/utils/abi/encodeFunctionData.d.ts:12

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
