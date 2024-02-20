---
editUrl: false
next: false
prev: false
title: "ContractFunctionName"
---

> **ContractFunctionName**\<`abi`, `mutability`\>: [`ExtractAbiFunctionNames`](/reference/tevm/utils/type-aliases/extractabifunctionnames/)\<`abi` extends [`Abi`](/reference/tevm/utils/type-aliases/abi/) ? `abi` : [`Abi`](/reference/tevm/utils/type-aliases/abi/), `mutability`\> extends infer functionName ? [`functionName`] extends [`never`] ? `string` : `functionName` : `string`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `abi` extends [`Abi`](/reference/tevm/utils/type-aliases/abi/) \| readonly `unknown`[] | [`Abi`](/reference/tevm/utils/type-aliases/abi/) |
| `mutability` extends `AbiStateMutability` | `AbiStateMutability` |

## Source

node\_modules/.pnpm/viem@2.7.9\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/types/contract.d.ts:5

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
