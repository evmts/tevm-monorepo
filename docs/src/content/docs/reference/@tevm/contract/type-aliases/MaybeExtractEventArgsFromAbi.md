---
editUrl: false
next: false
prev: false
title: "MaybeExtractEventArgsFromAbi"
---

> **MaybeExtractEventArgsFromAbi**\<`TAbi`, `TEventName`\>: `Exclude`\<`TAbi` *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) \| readonly `unknown`[] ? `TEventName` *extends* `string` ? [`GetEventArgs`](/reference/tevm/utils/type-aliases/geteventargs/)\<`TAbi`, `TEventName`\> : `undefined` : `undefined`, readonly `unknown`[] \| `Record`\<`string`, `unknown`\>\>

Extracts event arguments from an ABI.

## Type Parameters

• **TAbi** *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) \| readonly `unknown`[] \| `undefined`

The ABI type, can be an Abi, readonly unknown[], or undefined.

• **TEventName** *extends* `string` \| `undefined`

The name of the event, can be a string or undefined.

## Defined in

[event/EventActionCreator.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/event/EventActionCreator.ts#L20)
