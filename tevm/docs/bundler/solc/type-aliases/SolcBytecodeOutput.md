[**tevm**](../../../README.md)

***

[tevm](../../../modules.md) / [bundler/solc](../README.md) / SolcBytecodeOutput

# Type Alias: SolcBytecodeOutput

> **SolcBytecodeOutput**: `object` & `Omit`\<[`SolcDeployedBytecodeOutput`](SolcDeployedBytecodeOutput.md), `"immutableReferences"`\>

Defined in: bundler-packages/solc/types/src/solcTypes.d.ts:271

## Type declaration

### functionDebugData

> **functionDebugData**: `object`

#### Index Signature

\[`functionName`: `string`\]: [`SolcFunctionDebugData`](SolcFunctionDebugData.md)

### generatedSources

> **generatedSources**: [`SolcGeneratedSource`](SolcGeneratedSource.md)[]

### linkReferences

> **linkReferences**: `object`

#### Index Signature

\[`fileName`: `string`\]: `object`

### object

> **object**: `string`

### opcodes

> **opcodes**: `string`

### sourceMap

> **sourceMap**: `string`
