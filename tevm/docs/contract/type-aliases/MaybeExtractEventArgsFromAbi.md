**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [contract](../README.md) > MaybeExtractEventArgsFromAbi

# Type alias: MaybeExtractEventArgsFromAbi`<TAbi, TEventName>`

> **MaybeExtractEventArgsFromAbi**\<`TAbi`, `TEventName`\>: `TAbi` extends [`Abi`](../../index/type-aliases/Abi.md) \| readonly `unknown`[] ? `TEventName` extends `string` ? [`GetEventArgs`](../../index/type-aliases/GetEventArgs.md)\<`TAbi`, `TEventName`\> : `undefined` : `undefined`

Adapted from viem. This is a helper type to extract the event args from an abi

## Type parameters

| Parameter |
| :------ |
| `TAbi` extends [`Abi`](../../index/type-aliases/Abi.md) \| readonly `unknown`[] \| `undefined` |
| `TEventName` extends `string` \| `undefined` |

## Source

packages/contract/types/event/EventActionCreator.d.ts:5

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
