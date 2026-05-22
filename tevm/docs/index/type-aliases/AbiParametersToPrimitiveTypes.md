[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / AbiParametersToPrimitiveTypes

# Type Alias: AbiParametersToPrimitiveTypes\<abiParameters, abiParameterKind, experimental_namedTuples\>

> **AbiParametersToPrimitiveTypes**\<`abiParameters`, `abiParameterKind`, `experimental_namedTuples`\> = `experimental_namedTuples` *extends* `true` ? `AbiParametersToPrimitiveTypes_named`\<`abiParameters`, `abiParameterKind`\> : `AbiParametersToPrimitiveTypes_mapped`\<`abiParameters`, `abiParameterKind`\>

Converts array of AbiParameter to corresponding TypeScript primitive types.

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `abiParameters` *extends* readonly `AbiParameter`[] | - | Array of AbiParameter to convert to TypeScript representations |
| `abiParameterKind` *extends* `AbiParameterKind` | `AbiParameterKind` | Optional AbiParameterKind to narrow by parameter type |
| `experimental_namedTuples` *extends* `boolean` | `ResolvedRegister`\[`"experimental_namedTuples"`\] | - |

## Returns

Array of TypeScript primitive types
