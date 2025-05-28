[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / ExtractAbiFunctionNames

# Type Alias: ExtractAbiFunctionNames\<abi, abiStateMutability\>

> **ExtractAbiFunctionNames**\<`abi`, `abiStateMutability`\> = `ExtractAbiFunctions`\<`abi`, `abiStateMutability`\>\[`"name"`\]

Defined in: node\_modules/.pnpm/abitype@1.0.8\_typescript@5.8.3\_zod@3.25.30/node\_modules/abitype/dist/types/utils.d.ts:114

Extracts all [AbiFunction](AbiFunction.md) names from [Abi](Abi.md).

## Type Parameters

### abi

`abi` *extends* [`Abi`](Abi.md)

[Abi](Abi.md) to extract function names from

### abiStateMutability

`abiStateMutability` *extends* `AbiStateMutability` = `AbiStateMutability`

AbiStateMutability to filter by

## Returns

Union of function names
