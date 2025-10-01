[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / AbiParametersToPrimitiveTypes

# Type Alias: AbiParametersToPrimitiveTypes\<abiParameters, abiParameterKind\>

> **AbiParametersToPrimitiveTypes**\<`abiParameters`, `abiParameterKind`\> = `Pretty`\<`{ [key in keyof abiParameters]: AbiParameterToPrimitiveType<abiParameters[key], abiParameterKind> }`\>

Defined in: node\_modules/.pnpm/abitype@1.1.1\_typescript@5.9.3\_zod@4.1.11/node\_modules/abitype/dist/types/utils.d.ts:86

Converts array of AbiParameter to corresponding TypeScript primitive types.

## Type Parameters

### abiParameters

`abiParameters` *extends* readonly `AbiParameter`[]

Array of AbiParameter to convert to TypeScript representations

### abiParameterKind

`abiParameterKind` *extends* `AbiParameterKind` = `AbiParameterKind`

Optional AbiParameterKind to narrow by parameter type

## Returns

Array of TypeScript primitive types
