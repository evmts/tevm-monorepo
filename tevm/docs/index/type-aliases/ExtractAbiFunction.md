**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > ExtractAbiFunction

# Type alias: ExtractAbiFunction`<TAbi, TFunctionName, TAbiStateMutability>`

> **ExtractAbiFunction**\<`TAbi`, `TFunctionName`, `TAbiStateMutability`\>: `Extract`\<`ExtractAbiFunctions`\<`TAbi`, `TAbiStateMutability`\>, `object`\>

Extracts [AbiFunction](AbiFunction.md) with name from [Abi](Abi.md).

## Type parameters

| Parameter | Default | Description |
| :------ | :------ | :------ |
| `TAbi` extends [`Abi`](Abi.md) | - | [Abi](Abi.md) to extract [AbiFunction](AbiFunction.md) from |
| `TFunctionName` extends [`ExtractAbiFunctionNames`](ExtractAbiFunctionNames.md)\<`TAbi`\> | - | String name of function to extract from [Abi](Abi.md) |
| `TAbiStateMutability` extends `AbiStateMutability` | `AbiStateMutability` | [AbiStateMutability]([object Object]) to filter by |

## Source

node\_modules/.pnpm/abitype@1.0.2\_typescript@5.3.3\_zod@3.22.4/node\_modules/abitype/dist/types/utils.d.ts:123

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
