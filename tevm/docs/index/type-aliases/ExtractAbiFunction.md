[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / ExtractAbiFunction

# Type alias: ExtractAbiFunction\<TAbi, TFunctionName, TAbiStateMutability\>

> **ExtractAbiFunction**\<`TAbi`, `TFunctionName`, `TAbiStateMutability`\>: `Extract`\<`ExtractAbiFunctions`\<`TAbi`, `TAbiStateMutability`\>, `object`\>

Extracts [AbiFunction](AbiFunction.md) with name from [Abi](Abi.md).

## Type parameters

• **TAbi** *extends* [`Abi`](Abi.md)

[Abi](Abi.md) to extract [AbiFunction](AbiFunction.md) from

• **TFunctionName** *extends* [`ExtractAbiFunctionNames`](ExtractAbiFunctionNames.md)\<`TAbi`\>

String name of function to extract from [Abi](Abi.md)

• **TAbiStateMutability** *extends* `AbiStateMutability` = `AbiStateMutability`

AbiStateMutability to filter by

## Source

node\_modules/.pnpm/abitype@1.0.2\_typescript@5.5.2\_zod@3.23.8/node\_modules/abitype/dist/types/utils.d.ts:123
