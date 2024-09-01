---
editUrl: false
next: false
prev: false
title: "CreateEventFilterParameters"
---

> **CreateEventFilterParameters**\<`abiEvent`, `abiEvents`, `strict`, `fromBlock`, `toBlock`, `_eventName`, `_args`\>: `object` & `MaybeExtractEventArgsFromAbi`\<`abiEvents`, `_eventName`\> *extends* infer eventFilterArgs ? `object` \| `object` \| `object` \| `object` : `object`

## Type declaration

### address?

> `optional` **address**: `Address` \| `Address`[]

### fromBlock?

> `optional` **fromBlock**: `fromBlock` \| [`BlockNumber`](/reference/tevm/utils/type-aliases/blocknumber/) \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/)

### toBlock?

> `optional` **toBlock**: `toBlock` \| [`BlockNumber`](/reference/tevm/utils/type-aliases/blocknumber/) \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/)

## Type Parameters

• **abiEvent** *extends* `AbiEvent` \| `undefined` = `undefined`

• **abiEvents** *extends* readonly `AbiEvent`[] \| readonly `unknown`[] \| `undefined` = `abiEvent` *extends* `AbiEvent` ? [`abiEvent`] : `undefined`

• **strict** *extends* `boolean` \| `undefined` = `undefined`

• **fromBlock** *extends* [`BlockNumber`](/reference/tevm/utils/type-aliases/blocknumber/) \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/) \| `undefined` = `undefined`

• **toBlock** *extends* [`BlockNumber`](/reference/tevm/utils/type-aliases/blocknumber/) \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/) \| `undefined` = `undefined`

• **_eventName** *extends* `string` \| `undefined` = `MaybeAbiEventName`\<`abiEvent`\>

• **_args** *extends* `MaybeExtractEventArgsFromAbi`\<`abiEvents`, `_eventName`\> \| `undefined` = `undefined`

## Defined in

node\_modules/.pnpm/viem@2.21.1\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/actions/public/createEventFilter.d.ts:13
