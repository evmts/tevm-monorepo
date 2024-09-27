[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / ExtractAbiEvent

# Type Alias: ExtractAbiEvent\<abi, eventName\>

> **ExtractAbiEvent**\<`abi`, `eventName`\>: `Extract`\<[`ExtractAbiEvents`](ExtractAbiEvents.md)\<`abi`\>, `object`\>

Extracts [AbiEvent](AbiEvent.md) with name from [Abi](Abi.md).

## Type Parameters

• **abi** *extends* [`Abi`](Abi.md)

[Abi](Abi.md) to extract [AbiEvent](AbiEvent.md) from

• **eventName** *extends* [`ExtractAbiEventNames`](ExtractAbiEventNames.md)\<`abi`\>

String name of event to extract from [Abi](Abi.md)

## Defined in

node\_modules/.pnpm/abitype@1.0.6\_typescript@5.6.2\_zod@3.23.8/node\_modules/abitype/dist/types/utils.d.ts:149
