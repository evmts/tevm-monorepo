[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / FormatAbi

# Type Alias: FormatAbi\<abi\>

> **FormatAbi**\<`abi`\> = [`Abi`](Abi.md) *extends* `abi` ? readonly `string`[] : `abi` *extends* readonly \[\] ? `never` : `abi` *extends* [`Abi`](Abi.md) ? `{ [key in keyof abi]: FormatAbiItem<abi[key]> }` : readonly `string`[]

Parses JSON ABI into human-readable ABI

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `abi` *extends* [`Abi`](Abi.md) \| readonly `unknown`[] | ABI |

## Returns

Human-readable ABI
