[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / AbiParametersToPrimitiveTypes

# Type Alias: AbiParametersToPrimitiveTypes\<abiParameters, abiParameterKind\>

> **AbiParametersToPrimitiveTypes**\<`abiParameters`, `abiParameterKind`\>: `Pretty`\<`{ [key in keyof abiParameters]: AbiParameterToPrimitiveType<abiParameters[key], abiParameterKind> }`\>

Converts array of AbiParameter to corresponding TypeScript primitive types.

## Type Parameters

• **abiParameters** *extends* readonly `AbiParameter`[]

Array of AbiParameter to convert to TypeScript representations

• **abiParameterKind** *extends* `AbiParameterKind` = `AbiParameterKind`

Optional AbiParameterKind to narrow by parameter type

## Defined in

node\_modules/.pnpm/abitype@1.0.6\_typescript@5.6.2\_zod@3.23.8/node\_modules/abitype/dist/types/utils.d.ts:86
