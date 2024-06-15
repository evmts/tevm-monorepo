[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [contract](../README.md) / MaybeExtractEventArgsFromAbi

# Type alias: MaybeExtractEventArgsFromAbi\<TAbi, TEventName\>

> **MaybeExtractEventArgsFromAbi**\<`TAbi`, `TEventName`\>: `TAbi` *extends* [`Abi`](../../index/type-aliases/Abi.md) \| readonly `unknown`[] ? `TEventName` *extends* `string` ? [`GetEventArgs`](../../index/type-aliases/GetEventArgs.md)\<`TAbi`, `TEventName`\> : `undefined` : `undefined`

Adapted from viem. This is a helper type to extract the event args from an abi

## Type parameters

• **TAbi** *extends* [`Abi`](../../index/type-aliases/Abi.md) \| readonly `unknown`[] \| `undefined`

• **TEventName** *extends* `string` \| `undefined`

## Source

packages/contract/types/event/EventActionCreator.d.ts:5
