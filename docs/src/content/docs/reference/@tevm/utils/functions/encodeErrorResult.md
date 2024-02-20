---
editUrl: false
next: false
prev: false
title: "encodeErrorResult"
---

> **encodeErrorResult**\<`abi`, `errorName`\>(`parameters`): `EncodeErrorResultReturnType`

## Type parameters

▪ **abi** extends [`Abi`](/reference/tevm/utils/type-aliases/abi/) \| readonly `unknown`[]

▪ **errorName** extends `undefined` \| `string` = `undefined`

## Parameters

▪ **parameters**: `EncodeErrorResultParameters`\<`abi`, `errorName`, `abi` extends [`Abi`](/reference/tevm/utils/type-aliases/abi/) ? [`Abi`](/reference/tevm/utils/type-aliases/abi/) extends `abi` ? `true` : [`Extract`\<`abi`[`number`], `object`\>] extends [`never`] ? `false` : `true` : `true`, `ContractErrorArgs`\<`abi`, `errorName` extends `ContractErrorName`\<`abi`\> ? `errorName` : `ContractErrorName`\<`abi`\>\>, `ContractErrorName`\<`abi`\>\>

## Source

node\_modules/.pnpm/viem@2.7.9\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/utils/abi/encodeErrorResult.d.ts:23

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
