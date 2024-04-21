**@tevm/utils** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ExtractAbiEvent

# Type alias: ExtractAbiEvent`<TAbi, TEventName>`

> **ExtractAbiEvent**\<`TAbi`, `TEventName`\>: `Extract`\<[`ExtractAbiEvents`](ExtractAbiEvents.md)\<`TAbi`\>, `object`\>

Extracts [AbiEvent](AbiEvent.md) with name from [Abi](Abi.md).

## Type parameters

| Parameter | Description |
| :------ | :------ |
| `TAbi` extends [`Abi`](Abi.md) | [Abi](Abi.md) to extract [AbiEvent](AbiEvent.md) from |
| `TEventName` extends [`ExtractAbiEventNames`](ExtractAbiEventNames.md)\<`TAbi`\> | String name of event to extract from [Abi](Abi.md) |

## Source

node\_modules/.pnpm/abitype@1.0.2\_typescript@5.4.5\_zod@3.22.5/node\_modules/abitype/dist/types/utils.d.ts:149

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
