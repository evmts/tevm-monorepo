**@tevm/solc** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/solc](../README.md) / SolcBytecodeOutput

# Type alias: SolcBytecodeOutput

> **SolcBytecodeOutput**: `object` & `Omit`\<[`SolcDeployedBytecodeOutput`](SolcDeployedBytecodeOutput.md), `"immutableReferences"`\>

## Type declaration

### functionDebugData

> **functionDebugData**: `object`

#### Index signature

 \[`functionName`: `string`\]: [`SolcFunctionDebugData`](SolcFunctionDebugData.md)

### generatedSources

> **generatedSources**: [`SolcGeneratedSource`](SolcGeneratedSource.md)[]

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

[solcTypes.ts:459](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L459)
