[**@tevm/contract**](../README.md) • **Docs**

***

[@tevm/contract](../globals.md) / MaybeExtractEventArgsFromAbi

# Type Alias: MaybeExtractEventArgsFromAbi\<TAbi, TEventName\>

> **MaybeExtractEventArgsFromAbi**\<`TAbi`, `TEventName`\>: `Exclude`\<`TAbi` *extends* `Abi` \| readonly `unknown`[] ? `TEventName` *extends* `string` ? `GetEventArgs`\<`TAbi`, `TEventName`\> : `undefined` : `undefined`, readonly `unknown`[] \| `Record`\<`string`, `unknown`\>\>

Adapted from viem. This is a helper type to extract the event args from an abi

## Type Parameters

• **TAbi** *extends* `Abi` \| readonly `unknown`[] \| `undefined`

• **TEventName** *extends* `string` \| `undefined`

## Defined in

[event/EventActionCreator.ts:18](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/contract/src/event/EventActionCreator.ts#L18)
