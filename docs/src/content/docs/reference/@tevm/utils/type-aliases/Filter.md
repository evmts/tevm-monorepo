---
editUrl: false
next: false
prev: false
title: "Filter"
---

> **Filter**\<`filterType`, `abi`, `eventName`, `args`, `strict`, `fromBlock`, `toBlock`\>: `object` & `filterType` *extends* `"event"` ? `object` & `abi` *extends* `Abi` ? `undefined` *extends* `eventName` ? `object` : `args` *extends* `MaybeExtractEventArgsFromAbi`\<`abi`, `eventName`\> ? `object` : `object` : `object` : `object`

## Type declaration

### id

> **id**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

### request

> **request**: `EIP1193RequestFn`\<`FilterRpcSchema`\>

### type

> **type**: `filterType`

## Type Parameters

• **filterType** *extends* `FilterType` = `"event"`

• **abi** *extends* `Abi` \| readonly `unknown`[] \| `undefined` = `undefined`

• **eventName** *extends* `string` \| `undefined` = `undefined`

• **args** *extends* `MaybeExtractEventArgsFromAbi`\<`abi`, `eventName`\> \| `undefined` = `MaybeExtractEventArgsFromAbi`\<`abi`, `eventName`\>

• **strict** *extends* `boolean` \| `undefined` = `undefined`

• **fromBlock** *extends* [`BlockNumber`](/reference/tevm/utils/type-aliases/blocknumber/) \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/) \| `undefined` = `undefined`

• **toBlock** *extends* [`BlockNumber`](/reference/tevm/utils/type-aliases/blocknumber/) \| [`BlockTag`](/reference/tevm/utils/type-aliases/blocktag/) \| `undefined` = `undefined`

## Defined in

node\_modules/.pnpm/viem@2.21.7\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/types/filter.d.ts:11
