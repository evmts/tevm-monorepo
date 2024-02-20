---
editUrl: false
next: false
prev: false
title: "encodeEventTopics"
---

> **encodeEventTopics**\<`abi`, `eventName`\>(`parameters`): \`0x${string}\`[]

## Type parameters

▪ **abi** extends [`Abi`](/reference/tevm/utils/type-aliases/abi/) \| readonly `unknown`[]

▪ **eventName** extends `undefined` \| `string` = `undefined`

## Parameters

▪ **parameters**: `EncodeEventTopicsParameters`\<`abi`, `eventName`, `abi` extends [`Abi`](/reference/tevm/utils/type-aliases/abi/) ? [`Abi`](/reference/tevm/utils/type-aliases/abi/) extends `abi` ? `true` : [`Extract`\<`abi`[`number`], `object`\>] extends [`never`] ? `false` : `true` : `true`, `ContractEventArgs`\<`abi`, `eventName` extends `ContractEventName`\<`abi`\> ? `eventName` : `ContractEventName`\<`abi`\>\>, `ContractEventName`\<`abi`\>\>

## Source

node\_modules/.pnpm/viem@2.7.9\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/utils/abi/encodeEventTopics.d.ts:24

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
