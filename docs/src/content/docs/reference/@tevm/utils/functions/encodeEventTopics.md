---
editUrl: false
next: false
prev: false
title: "encodeEventTopics"
---

> **encodeEventTopics**\<`abi`, `eventName`\>(`parameters`): ```0x${string}```[]

## Type parameters

• **abi** extends readonly `unknown`[] \| `Abi`

• **eventName** extends `undefined` \| `string` = `undefined`

## Parameters

• **parameters**: `EncodeEventTopicsParameters`\<`abi`, `eventName`, `abi` extends `Abi` ? `Abi` extends `abi`\<`abi`\> ? `true` : [`Extract`\<`abi`\<`abi`\>\[`number`\], `object`\>] extends [`never`] ? `false` : `true` : `true`, `ContractEventArgs`\<`abi`, `eventName` extends `ContractEventName`\<`abi`\> ? `eventName`\<`eventName`\> : `ContractEventName`\<`abi`\>\>, `ContractEventName`\<`abi`\>\>

## Returns

```0x${string}```[]

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5/node\_modules/viem/\_types/utils/abi/encodeEventTopics.d.ts:24
