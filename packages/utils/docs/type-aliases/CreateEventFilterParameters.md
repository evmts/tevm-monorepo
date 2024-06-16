[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / CreateEventFilterParameters

# Type alias: CreateEventFilterParameters\<TAbiEvent, TAbiEvents, TStrict, TFromBlock, TToBlock, _EventName, _Args\>

> **CreateEventFilterParameters**\<`TAbiEvent`, `TAbiEvents`, `TStrict`, `TFromBlock`, `TToBlock`, `_EventName`, `_Args`\>: `object` & `MaybeExtractEventArgsFromAbi`\<`TAbiEvents`, `_EventName`\> *extends* infer TEventFilterArgs ? `object` \| `object` \| `object` \| `object` : `object`

## Type declaration

### address?

> `optional` **address**: `Address` \| `Address`[]

### fromBlock?

> `optional` **fromBlock**: `TFromBlock` \| [`BlockNumber`](BlockNumber.md) \| [`BlockTag`](BlockTag.md)

### toBlock?

> `optional` **toBlock**: `TToBlock` \| [`BlockNumber`](BlockNumber.md) \| [`BlockTag`](BlockTag.md)

## Type parameters

• **TAbiEvent** *extends* `AbiEvent` \| `undefined` = `undefined`

• **TAbiEvents** *extends* readonly `AbiEvent`[] \| readonly `unknown`[] \| `undefined` = `TAbiEvent` *extends* `AbiEvent` ? [`TAbiEvent`] : `undefined`

• **TStrict** *extends* `boolean` \| `undefined` = `undefined`

• **TFromBlock** *extends* [`BlockNumber`](BlockNumber.md) \| [`BlockTag`](BlockTag.md) \| `undefined` = `undefined`

• **TToBlock** *extends* [`BlockNumber`](BlockNumber.md) \| [`BlockTag`](BlockTag.md) \| `undefined` = `undefined`

• **_EventName** *extends* `string` \| `undefined` = `MaybeAbiEventName`\<`TAbiEvent`\>

• **_Args** *extends* `MaybeExtractEventArgsFromAbi`\<`TAbiEvents`, `_EventName`\> \| `undefined` = `undefined`

## Source

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.4.5\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/actions/public/createEventFilter.d.ts:13
