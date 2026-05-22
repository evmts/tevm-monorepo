[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / ExtractAbiFunction

# Type Alias: ExtractAbiFunction\<abi, functionName, abiStateMutability\>

> **ExtractAbiFunction**\<`abi`, `functionName`, `abiStateMutability`\> = `Extract`\<`ExtractAbiFunctions`\<`abi`, `abiStateMutability`\>, \{ `name`: `functionName`; \}\>

Extracts [AbiFunction](AbiFunction.md) with name from [Abi](Abi.md).

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `abi` *extends* [`Abi`](Abi.md) | - | [Abi](Abi.md) to extract [AbiFunction](AbiFunction.md) from |
| `functionName` *extends* [`ExtractAbiFunctionNames`](ExtractAbiFunctionNames.md)\<`abi`\> | - | String name of function to extract from [Abi](Abi.md) |
| `abiStateMutability` *extends* `AbiStateMutability` | `AbiStateMutability` | AbiStateMutability to filter by |

## Returns

Matching [AbiFunction](AbiFunction.md)
