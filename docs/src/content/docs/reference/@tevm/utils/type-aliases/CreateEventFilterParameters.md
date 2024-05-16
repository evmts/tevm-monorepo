---
editUrl: false
next: false
prev: false
title: "CreateEventFilterParameters"
---

> **CreateEventFilterParameters**\<`TAbiEvent`, `TAbiEvents`, `TStrict`, `TFromBlock`, `TToBlock`, `_EventName`, `_Args`\>: `object` & `MaybeExtractEventArgsFromAbi`\<`TAbiEvents`, `_EventName`\> *extends* infer TEventFilterArgs ? `object` \| `object` \| `object` \| `object` : `object`

## Type declaration

### address?

> `optional` **address**: `Address` \| `Address`[]

### fromBlock?

> `optional` **fromBlock**: `TFromBlock` \| [`BlockNumber`](/reference/tevm/utils/type-aliases/blocknumber/) \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/)

### toBlock?

> `optional` **toBlock**: `TToBlock` \| [`BlockNumber`](/reference/tevm/utils/type-aliases/blocknumber/) \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/)

## Type parameters

• **TAbiEvent** *extends* `AbiEvent` \| `undefined` = `undefined`

• **TAbiEvents** *extends* readonly `AbiEvent`[] \| readonly `unknown`[] \| `undefined` = `TAbiEvent` *extends* `AbiEvent` ? [`TAbiEvent`] : `undefined`

• **TStrict** *extends* `boolean` \| `undefined` = `undefined`

• **TFromBlock** *extends* [`BlockNumber`](/reference/tevm/utils/type-aliases/blocknumber/) \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/) \| `undefined` = `undefined`

• **TToBlock** *extends* [`BlockNumber`](/reference/tevm/utils/type-aliases/blocknumber/) \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/) \| `undefined` = `undefined`

• **_EventName** *extends* `string` \| `undefined` = `MaybeAbiEventName`\<`TAbiEvent`\>

• **_Args** *extends* `MaybeExtractEventArgsFromAbi`\<`TAbiEvents`, `_EventName`\> \| `undefined` = `undefined`

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5\_zod@3.23.8/node\_modules/viem/\_types/actions/public/createEventFilter.d.ts:13
