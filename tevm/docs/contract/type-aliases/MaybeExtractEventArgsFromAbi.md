[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [contract](../README.md) / MaybeExtractEventArgsFromAbi

# Type Alias: MaybeExtractEventArgsFromAbi\<TAbi, TEventName\>

> **MaybeExtractEventArgsFromAbi**\<`TAbi`, `TEventName`\> = `TAbi` *extends* [`Abi`](../../index/type-aliases/Abi.md) \| readonly `unknown`[] ? `TEventName` *extends* `string` ? [`GetEventArgs`](../../index/type-aliases/GetEventArgs.md)\<`TAbi`, `TEventName`\> : `undefined` : `undefined`

Extracts event arguments from an ABI.

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `TAbi` *extends* [`Abi`](../../index/type-aliases/Abi.md) \| readonly `unknown`[] \| `undefined` | The ABI type, can be an Abi, readonly unknown[], or undefined. |
| `TEventName` *extends* `string` \| `undefined` | The name of the event, can be a string or undefined. |
