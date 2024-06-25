[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [contract](../README.md) / MaybeExtractEventArgsFromAbi

# Type Alias: MaybeExtractEventArgsFromAbi\<TAbi, TEventName\>

> **MaybeExtractEventArgsFromAbi**\<`TAbi`, `TEventName`\>: `Exclude`\<`TAbi` *extends* [`Abi`](../../index/type-aliases/Abi.md) \| readonly `unknown`[] ? `TEventName` *extends* `string` ? [`GetEventArgs`](../../index/type-aliases/GetEventArgs.md)\<`TAbi`, `TEventName`\> : `undefined` : `undefined`, readonly `unknown`[] \| `Record`\<`string`, `unknown`\>\>

Adapted from viem. This is a helper type to extract the event args from an abi

## Type Parameters

• **TAbi** *extends* [`Abi`](../../index/type-aliases/Abi.md) \| readonly `unknown`[] \| `undefined`

• **TEventName** *extends* `string` \| `undefined`

## Defined in

packages/contract/types/event/EventActionCreator.d.ts:5
