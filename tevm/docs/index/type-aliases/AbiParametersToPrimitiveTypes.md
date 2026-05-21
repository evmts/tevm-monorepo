[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / AbiParametersToPrimitiveTypes

# Type Alias: AbiParametersToPrimitiveTypes\<abiParameters, abiParameterKind, experimental_namedTuples\>

> **AbiParametersToPrimitiveTypes**\<`abiParameters`, `abiParameterKind`, `experimental_namedTuples`\> = `experimental_namedTuples` *extends* `true` ? `AbiParametersToPrimitiveTypes_named`\<`abiParameters`, `abiParameterKind`\> : `AbiParametersToPrimitiveTypes_mapped`\<`abiParameters`, `abiParameterKind`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/abitype@1.2.4\_typescript@6.0.3\_zod@4.4.3/node\_modules/abitype/dist/types/utils.d.ts:87

Converts array of AbiParameter to corresponding TypeScript primitive types.

## Type Parameters

### abiParameters

`abiParameters` *extends* readonly `AbiParameter`[]

Array of AbiParameter to convert to TypeScript representations

### abiParameterKind

`abiParameterKind` *extends* `AbiParameterKind` = `AbiParameterKind`

Optional AbiParameterKind to narrow by parameter type

### experimental_namedTuples

`experimental_namedTuples` *extends* `boolean` = `ResolvedRegister`\[`"experimental_namedTuples"`\]

## Returns

Array of TypeScript primitive types
