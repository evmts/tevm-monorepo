**@tevm/utils** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > AbiParametersToPrimitiveTypes

# Type alias: AbiParametersToPrimitiveTypes`<TAbiParameters, TAbiParameterKind>`

> **AbiParametersToPrimitiveTypes**\<`TAbiParameters`, `TAbiParameterKind`\>: `Pretty`\<`{ [K in keyof TAbiParameters]: AbiParameterToPrimitiveType<TAbiParameters[K], TAbiParameterKind> }`\>

Converts array of [AbiParameter]([object Object]) to corresponding TypeScript primitive types.

## Type parameters

| Parameter | Default | Description |
| :------ | :------ | :------ |
| `TAbiParameters` extends readonly `AbiParameter`[] | - | Array of [AbiParameter]([object Object]) to convert to TypeScript representations |
| `TAbiParameterKind` extends `AbiParameterKind` | `AbiParameterKind` | Optional [AbiParameterKind]([object Object]) to narrow by parameter type |

## Source

node\_modules/.pnpm/abitype@1.0.2\_typescript@5.4.5\_zod@3.23.4/node\_modules/abitype/dist/types/utils.d.ts:86

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
