[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / ExtractAbiFunction

# Type Alias: ExtractAbiFunction\<abi, functionName, abiStateMutability\>

> **ExtractAbiFunction**\<`abi`, `functionName`, `abiStateMutability`\> = `Extract`\<`ExtractAbiFunctions`\<`abi`, `abiStateMutability`\>, \{ `name`: `functionName`; \}\>

Defined in: tevm-monorepo/node\_modules/.pnpm/abitype@1.2.4\_typescript@6.0.3\_zod@4.4.3/node\_modules/abitype/dist/types/utils.d.ts:187

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
