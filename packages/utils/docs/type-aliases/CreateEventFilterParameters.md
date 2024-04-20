**@tevm/utils** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > CreateEventFilterParameters

# Type alias: CreateEventFilterParameters`<TAbiEvent, TAbiEvents, TStrict, TFromBlock, TToBlock, _EventName, _Args>`

> **CreateEventFilterParameters**\<`TAbiEvent`, `TAbiEvents`, `TStrict`, `TFromBlock`, `TToBlock`, `_EventName`, `_Args`\>: `object` & `MaybeExtractEventArgsFromAbi`\<`TAbiEvents`, `_EventName`\> extends infer TEventFilterArgs ? `object` \| `object` \| `object` \| `object` : `object`

## Type declaration

### address

> **address**?: `Address` \| `Address`[]

### fromBlock

> **fromBlock**?: `TFromBlock` \| [`BlockNumber`](BlockNumber.md) \| [`BlockTag`](BlockTag.md)

### toBlock

> **toBlock**?: `TToBlock` \| [`BlockNumber`](BlockNumber.md) \| [`BlockTag`](BlockTag.md)

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TAbiEvent` extends `AbiEvent` \| `undefined` | `undefined` |
| `TAbiEvents` extends readonly `AbiEvent`[] \| readonly `unknown`[] \| `undefined` | `TAbiEvent` extends `AbiEvent` ? [`TAbiEvent`] : `undefined` |
| `TStrict` extends `boolean` \| `undefined` | `undefined` |
| `TFromBlock` extends [`BlockNumber`](BlockNumber.md) \| [`BlockTag`](BlockTag.md) \| `undefined` | `undefined` |
| `TToBlock` extends [`BlockNumber`](BlockNumber.md) \| [`BlockTag`](BlockTag.md) \| `undefined` | `undefined` |
| `_EventName` extends `string` \| `undefined` | `MaybeAbiEventName`\<`TAbiEvent`\> |
| `_Args` extends `MaybeExtractEventArgsFromAbi`\<`TAbiEvents`, `_EventName`\> \| `undefined` | `undefined` |

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5\_zod@3.22.5/node\_modules/viem/\_types/actions/public/createEventFilter.d.ts:13

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
