[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / ExtractAbiEvent

# Type Alias: ExtractAbiEvent\<abi, eventName\>

> **ExtractAbiEvent**\<`abi`, `eventName`\> = `Extract`\<[`ExtractAbiEvents`](ExtractAbiEvents.md)\<`abi`\>, \{ `name`: `eventName`; \}\>

Defined in: node\_modules/.pnpm/abitype@1.0.8\_typescript@5.8.3\_zod@3.25.30/node\_modules/abitype/dist/types/utils.d.ts:149

Extracts [AbiEvent](AbiEvent.md) with name from [Abi](Abi.md).

## Type Parameters

### abi

`abi` *extends* [`Abi`](Abi.md)

[Abi](Abi.md) to extract [AbiEvent](AbiEvent.md) from

### eventName

`eventName` *extends* [`ExtractAbiEventNames`](ExtractAbiEventNames.md)\<`abi`\>

String name of event to extract from [Abi](Abi.md)

## Returns

Matching [AbiEvent](AbiEvent.md)
