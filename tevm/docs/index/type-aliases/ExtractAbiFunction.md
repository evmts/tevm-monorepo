[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / ExtractAbiFunction

# Type Alias: ExtractAbiFunction\<abi, functionName, abiStateMutability\>

> **ExtractAbiFunction**\<`abi`, `functionName`, `abiStateMutability`\>: `Extract`\<`ExtractAbiFunctions`\<`abi`, `abiStateMutability`\>, `object`\>

Extracts [AbiFunction](AbiFunction.md) with name from [Abi](Abi.md).

## Type Parameters

• **abi** *extends* [`Abi`](Abi.md)

[Abi](Abi.md) to extract [AbiFunction](AbiFunction.md) from

• **functionName** *extends* [`ExtractAbiFunctionNames`](ExtractAbiFunctionNames.md)\<`abi`\>

String name of function to extract from [Abi](Abi.md)

• **abiStateMutability** *extends* `AbiStateMutability` = `AbiStateMutability`

AbiStateMutability to filter by

## Defined in

node\_modules/.pnpm/abitype@1.0.6\_typescript@5.7.3\_zod@3.23.8/node\_modules/abitype/dist/types/utils.d.ts:123
