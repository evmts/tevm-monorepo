---
editUrl: false
next: false
prev: false
title: "MaybeExtractEventArgsFromAbi"
---

> **MaybeExtractEventArgsFromAbi**\<`TAbi`, `TEventName`\>: `TAbi` extends `Abi` \| readonly `unknown`[] ? `TEventName` extends `string` ? `GetEventArgs`\<`TAbi`, `TEventName`\> : `undefined` : `undefined`

Adapted from viem. This is a helper type to extract the event args from an abi

## Type parameters

| Parameter |
| :------ |
| `TAbi` extends `Abi` \| readonly `unknown`[] \| `undefined` |
| `TEventName` extends `string` \| `undefined` |

## Source

[event/EventActionCreator.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/event/EventActionCreator.ts#L18)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
