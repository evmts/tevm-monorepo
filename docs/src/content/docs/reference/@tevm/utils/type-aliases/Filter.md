---
editUrl: false
next: false
prev: false
title: "Filter"
---

> **Filter**\<`TFilterType`, `TAbi`, `TEventName`, `TArgs`, `TStrict`, `TFromBlock`, `TToBlock`\>: `object` & `TFilterType` *extends* `"event"` ? `object` & `TAbi` *extends* `Abi` ? `undefined` *extends* `TEventName` ? `object` : `TArgs` *extends* `MaybeExtractEventArgsFromAbi`\<`TAbi`, `TEventName`\> ? `object` : `object` : `object` : `object`

## Type declaration

### id

> **id**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

### request

> **request**: `EIP1193RequestFn`\<`FilterRpcSchema`\>

### type

> **type**: `TFilterType`

## Type parameters

• **TFilterType** *extends* `FilterType` = `"event"`

• **TAbi** *extends* `Abi` \| readonly `unknown`[] \| `undefined` = `undefined`

• **TEventName** *extends* `string` \| `undefined` = `undefined`

• **TArgs** *extends* `MaybeExtractEventArgsFromAbi`\<`TAbi`, `TEventName`\> \| `undefined` = `MaybeExtractEventArgsFromAbi`\<`TAbi`, `TEventName`\>

• **TStrict** *extends* `boolean` \| `undefined` = `undefined`

• **TFromBlock** *extends* [`BlockNumber`](/reference/tevm/utils/type-aliases/blocknumber/) \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/) \| `undefined` = `undefined`

• **TToBlock** *extends* [`BlockNumber`](/reference/tevm/utils/type-aliases/blocknumber/) \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/) \| `undefined` = `undefined`

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5\_zod@3.23.8/node\_modules/viem/\_types/types/filter.d.ts:11
