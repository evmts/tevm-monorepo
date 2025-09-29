[**@tevm/solc**](../README.md)

***

[@tevm/solc](../globals.md) / SolcBytecodeOutput

# Type Alias: SolcBytecodeOutput

> **SolcBytecodeOutput** = `object` & `Omit`\<[`SolcDeployedBytecodeOutput`](SolcDeployedBytecodeOutput.md), `"immutableReferences"`\>

Defined in: [solcTypes.ts:580](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L580)

## Type Declaration

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
