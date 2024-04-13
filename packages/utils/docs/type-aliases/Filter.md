**@tevm/utils** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > Filter

# Type alias: Filter`<TFilterType, TAbi, TEventName, TArgs, TStrict, TFromBlock, TToBlock>`

> **Filter**\<`TFilterType`, `TAbi`, `TEventName`, `TArgs`, `TStrict`, `TFromBlock`, `TToBlock`\>: `object` & `TFilterType` extends `"event"` ? `object` & `TAbi` extends `Abi` ? `undefined` extends `TEventName` ? `object` : `TArgs` extends `MaybeExtractEventArgsFromAbi`\<`TAbi`, `TEventName`\> ? `object` : `object` : `object` : `object`

## Type declaration

### id

> **id**: [`Hex`](Hex.md)

### request

> **request**: `EIP1193RequestFn`\<`FilterRpcSchema`\>

### type

> **type**: `TFilterType`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TFilterType` extends `FilterType` | `"event"` |
| `TAbi` extends `Abi` \| readonly `unknown`[] \| `undefined` | `undefined` |
| `TEventName` extends `string` \| `undefined` | `undefined` |
| `TArgs` extends `MaybeExtractEventArgsFromAbi`\<`TAbi`, `TEventName`\> \| `undefined` | `MaybeExtractEventArgsFromAbi`\<`TAbi`, `TEventName`\> |
| `TStrict` extends `boolean` \| `undefined` | `undefined` |
| `TFromBlock` extends [`BlockNumber`](BlockNumber.md) \| [`BlockTag`](BlockTag.md) \| `undefined` | `undefined` |
| `TToBlock` extends [`BlockNumber`](BlockNumber.md) \| [`BlockTag`](BlockTag.md) \| `undefined` | `undefined` |

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/types/filter.d.ts:11

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
