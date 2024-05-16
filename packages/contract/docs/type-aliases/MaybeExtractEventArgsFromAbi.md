[**@tevm/contract**](../README.md) • **Docs**

***

[@tevm/contract](../globals.md) / MaybeExtractEventArgsFromAbi

# Type alias: MaybeExtractEventArgsFromAbi\<TAbi, TEventName\>

> **MaybeExtractEventArgsFromAbi**\<`TAbi`, `TEventName`\>: `TAbi` *extends* `Abi` \| readonly `unknown`[] ? `TEventName` *extends* `string` ? `GetEventArgs`\<`TAbi`, `TEventName`\> : `undefined` : `undefined`

Adapted from viem. This is a helper type to extract the event args from an abi

## Type parameters

• **TAbi** *extends* `Abi` \| readonly `unknown`[] \| `undefined`

• **TEventName** *extends* `string` \| `undefined`

## Source

[event/EventActionCreator.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/event/EventActionCreator.ts#L18)
