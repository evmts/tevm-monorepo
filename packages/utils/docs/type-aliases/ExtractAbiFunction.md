[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / ExtractAbiFunction

# Type Alias: ExtractAbiFunction\<abi, functionName, abiStateMutability\>

> **ExtractAbiFunction**\<`abi`, `functionName`, `abiStateMutability`\>: `Extract`\<`ExtractAbiFunctions`\<`abi`, `abiStateMutability`\>, \{ `name`: `functionName`; \}\>

Defined in: node\_modules/.pnpm/abitype@1.0.8\_typescript@5.8.3\_zod@3.24.3/node\_modules/abitype/dist/types/utils.d.ts:123

Extracts [AbiFunction](AbiFunction.md) with name from [Abi](Abi.md).

## Type Parameters

• **abi** *extends* [`Abi`](Abi.md)

[Abi](Abi.md) to extract [AbiFunction](AbiFunction.md) from

• **functionName** *extends* [`ExtractAbiFunctionNames`](ExtractAbiFunctionNames.md)\<`abi`\>

String name of function to extract from [Abi](Abi.md)

• **abiStateMutability** *extends* `AbiStateMutability` = `AbiStateMutability`

AbiStateMutability to filter by

## Returns

Matching [AbiFunction](AbiFunction.md)
