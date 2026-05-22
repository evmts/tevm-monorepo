[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / ExtractAbiEvent

# Type Alias: ExtractAbiEvent\<abi, eventName\>

> **ExtractAbiEvent**\<`abi`, `eventName`\> = `Extract`\<[`ExtractAbiEvents`](ExtractAbiEvents.md)\<`abi`\>, \{ `name`: `eventName`; \}\>

Extracts [AbiEvent](AbiEvent.md) with name from [Abi](Abi.md).

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `abi` *extends* [`Abi`](Abi.md) | [Abi](Abi.md) to extract [AbiEvent](AbiEvent.md) from |
| `eventName` *extends* [`ExtractAbiEventNames`](ExtractAbiEventNames.md)\<`abi`\> | String name of event to extract from [Abi](Abi.md) |

## Returns

Matching [AbiEvent](AbiEvent.md)
