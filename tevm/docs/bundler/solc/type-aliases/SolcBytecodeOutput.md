**tevm** ∙ [README](../../../README.md) ∙ [API](../../../API.md)

***

[API](../../../API.md) > [bundler/solc](../README.md) > SolcBytecodeOutput

# Type alias: SolcBytecodeOutput

> **SolcBytecodeOutput**: `object` & `Omit`\<[`SolcDeployedBytecodeOutput`](SolcDeployedBytecodeOutput.md), `"immutableReferences"`\>

## Type declaration

### functionDebugData

> **functionDebugData**: `object`

#### Index signature

 \[`functionName`: `string`\]: [`SolcFunctionDebugData`](SolcFunctionDebugData.md)

### generatedSources

> **generatedSources**: `SolcGeneratedSource`[]

### linkReferences

> **linkReferences**: `object`

#### Index signature

 \[`fileName`: `string`\]: `object`

### object

> **object**: `string`

### opcodes

> **opcodes**: `string`

### sourceMap

> **sourceMap**: `string`

## Source

bundler/solc/types/src/solcTypes.d.ts:156

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
