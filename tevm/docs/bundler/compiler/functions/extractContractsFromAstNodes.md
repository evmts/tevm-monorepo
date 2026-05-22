[**tevm**](../../../README.md)

***

[tevm](../../../modules.md) / [bundler/compiler](../README.md) / extractContractsFromAstNodes

# Function: extractContractsFromAstNodes()

> **extractContractsFromAstNodes**\<`TWithSourceMap`\>(`sourceUnits`, `options`): `object`

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TWithSourceMap` *extends* `boolean` | `false` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `sourceUnits` | `SourceUnit`[] |
| `options` | `CompileBaseOptions`\<[`SolcLanguage`](../../solc/type-aliases/SolcLanguage.md), (`"abi"` \| `"userdoc"` \| `"*"` \| `"ast"` \| `"devdoc"` \| `"evm.assembly"` \| `"evm.bytecode"` \| `"evm.bytecode.functionDebugData"` \| `"evm.bytecode.generatedSources"` \| `"evm.bytecode.linkReferences"` \| `"evm.bytecode.object"` \| `"evm.bytecode.opcodes"` \| `"evm.bytecode.sourceMap"` \| `"evm.deployedBytecode"` \| `"evm.deployedBytecode.immutableReferences"` \| `"evm.deployedBytecode.sourceMap"` \| `"evm.deployedBytecode.opcodes"` \| `"evm.deployedBytecode.object"` \| `"evm.gasEstimates"` \| `"evm.methodIdentifiers"` \| `"evm.legacyAssembly"` \| `"evm.storageLayout"` \| `"ewasm.wasm"` \| `"ewasm.wast"` \| `"ir"` \| `"irOptimized"` \| `"metadata"` \| `"storageLayout"`)[] \| `undefined`\> & `object` |

## Returns

`object`

### sourceMaps

> **sourceMaps**: `TSourceMaps`\<`TWithSourceMap`\>

### sources

> **sources**: `object`

#### Index Signature

\[`sourcePath`: `string`\]: `string`
