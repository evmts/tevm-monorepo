---
editUrl: false
next: false
prev: false
title: "EncodeEventTopicsParameters"
---

> **EncodeEventTopicsParameters**\<`abi`, `eventName`, `hasEvents`, `allArgs`, `allErrorNames`\>: `object` & `UnionEvaluate`\<`IsNarrowable`\<`abi`, `Abi`\> *extends* `true` ? `abi`\[`"length"`\] *extends* `1` ? `object` : `object` : `object`\> & `hasEvents` *extends* `true` ? `unknown` : `never`

## Type declaration

### abi

> **abi**: `abi`

### args?

> `optional` **args**: `allArgs`

## Type Parameters

• **abi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

• **eventName** *extends* `ContractEventName`\<`abi`\> \| `undefined` = `ContractEventName`\<`abi`\>

• **hasEvents** = `abi` *extends* `Abi` ? `Abi` *extends* `abi` ? `true` : [`ExtractAbiEvents`\<`abi`\>] *extends* [`never`] ? `false` : `true` : `true`

• **allArgs** = `ContractEventArgs`\<`abi`, `eventName` *extends* `ContractEventName`\<`abi`\> ? `eventName` : `ContractEventName`\<`abi`\>\>

• **allErrorNames** = `ContractEventName`\<`abi`\>

## Defined in

node\_modules/.pnpm/viem@2.21.7\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/abi/encodeEventTopics.d.ts:14
