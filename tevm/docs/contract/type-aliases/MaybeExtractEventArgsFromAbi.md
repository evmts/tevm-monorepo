[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [contract](../README.md) / MaybeExtractEventArgsFromAbi

# Type Alias: MaybeExtractEventArgsFromAbi\<TAbi, TEventName\>

> **MaybeExtractEventArgsFromAbi**\<`TAbi`, `TEventName`\>: `Exclude`\<`TAbi` *extends* [`Abi`](../../index/type-aliases/Abi.md) \| readonly `unknown`[] ? `TEventName` *extends* `string` ? [`GetEventArgs`](../../index/type-aliases/GetEventArgs.md)\<`TAbi`, `TEventName`\> : `undefined` : `undefined`, readonly `unknown`[] \| `Record`\<`string`, `unknown`\>\>

Defined in: packages/contract/types/event/EventActionCreator.d.ts:7

Extracts event arguments from an ABI.

## Type Parameters

• **TAbi** *extends* [`Abi`](../../index/type-aliases/Abi.md) \| readonly `unknown`[] \| `undefined`

The ABI type, can be an Abi, readonly unknown[], or undefined.

• **TEventName** *extends* `string` \| `undefined`

The name of the event, can be a string or undefined.
