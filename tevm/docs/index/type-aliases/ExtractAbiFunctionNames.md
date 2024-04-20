**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > ExtractAbiFunctionNames

# Type alias: ExtractAbiFunctionNames`<TAbi, TAbiStateMutability>`

> **ExtractAbiFunctionNames**\<`TAbi`, `TAbiStateMutability`\>: `ExtractAbiFunctions`\<`TAbi`, `TAbiStateMutability`\>[`"name"`]

Extracts all [AbiFunction](AbiFunction.md) names from [Abi](Abi.md).

## Type parameters

| Parameter | Default | Description |
| :------ | :------ | :------ |
| `TAbi` extends [`Abi`](Abi.md) | - | [Abi](Abi.md) to extract function names from |
| `TAbiStateMutability` extends `AbiStateMutability` | `AbiStateMutability` | [AbiStateMutability]([object Object]) to filter by |

## Source

node\_modules/.pnpm/abitype@1.0.2\_typescript@5.4.5\_zod@3.22.5/node\_modules/abitype/dist/types/utils.d.ts:114

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
