[**@tevm/contract**](../README.md) • **Docs**

***

[@tevm/contract](../globals.md) / MaybeExtractEventArgsFromAbi

# Type Alias: MaybeExtractEventArgsFromAbi\<TAbi, TEventName\>

> **MaybeExtractEventArgsFromAbi**\<`TAbi`, `TEventName`\>: `Exclude`\<`TAbi` *extends* `Abi` \| readonly `unknown`[] ? `TEventName` *extends* `string` ? `GetEventArgs`\<`TAbi`, `TEventName`\> : `undefined` : `undefined`, readonly `unknown`[] \| `Record`\<`string`, `unknown`\>\>

Extracts event arguments from an ABI.

## Type Parameters

• **TAbi** *extends* `Abi` \| readonly `unknown`[] \| `undefined`

The ABI type, can be an Abi, readonly unknown[], or undefined.

• **TEventName** *extends* `string` \| `undefined`

The name of the event, can be a string or undefined.

## Defined in

[event/EventActionCreator.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/event/EventActionCreator.ts#L20)
