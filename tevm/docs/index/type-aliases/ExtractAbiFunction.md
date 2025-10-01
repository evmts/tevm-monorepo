[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / ExtractAbiFunction

# Type Alias: ExtractAbiFunction\<abi, functionName, abiStateMutability\>

> **ExtractAbiFunction**\<`abi`, `functionName`, `abiStateMutability`\> = `Extract`\<`ExtractAbiFunctions`\<`abi`, `abiStateMutability`\>, \{ `name`: `functionName`; \}\>

Defined in: node\_modules/.pnpm/abitype@1.1.1\_typescript@5.9.3\_zod@4.1.11/node\_modules/abitype/dist/types/utils.d.ts:123

Extracts [AbiFunction](AbiFunction.md) with name from [Abi](Abi.md).

## Type Parameters

### abi

`abi` *extends* [`Abi`](Abi.md)

[Abi](Abi.md) to extract [AbiFunction](AbiFunction.md) from

### functionName

`functionName` *extends* [`ExtractAbiFunctionNames`](ExtractAbiFunctionNames.md)\<`abi`\>

String name of function to extract from [Abi](Abi.md)

### abiStateMutability

`abiStateMutability` *extends* `AbiStateMutability` = `AbiStateMutability`

AbiStateMutability to filter by

## Returns

Matching [AbiFunction](AbiFunction.md)
