[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / ExtractAbiFunctionNames

# Type Alias: ExtractAbiFunctionNames\<abi, abiStateMutability\>

> **ExtractAbiFunctionNames**\<`abi`, `abiStateMutability`\> = `ExtractAbiFunctions`\<`abi`, `abiStateMutability`\>\[`"name"`\]

Extracts all [AbiFunction](AbiFunction.md) names from [Abi](Abi.md).

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `abi` *extends* [`Abi`](Abi.md) | - | [Abi](Abi.md) to extract function names from |
| `abiStateMutability` *extends* `AbiStateMutability` | `AbiStateMutability` | AbiStateMutability to filter by |

## Returns

Union of function names
