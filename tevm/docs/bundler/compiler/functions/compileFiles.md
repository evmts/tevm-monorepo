[**tevm**](../../../README.md)

***

[tevm](../../../modules.md) / [bundler/compiler](../README.md) / compileFiles

# Function: compileFiles()

> **compileFiles**\<`TLanguage`, `TCompilationOutput`, `TFilePaths`\>(`filePaths`, `options?`): `Promise`\<`CompileFilesResult`\<`TCompilationOutput`, `TFilePaths`\>\>

## Type Parameters

| Type Parameter |
| ------ |
| `TLanguage` *extends* [`SolcLanguage`](../../solc/type-aliases/SolcLanguage.md) |
| `TCompilationOutput` *extends* (`"abi"` \| `"userdoc"` \| `"*"` \| `"ast"` \| `"devdoc"` \| `"evm.assembly"` \| `"evm.bytecode"` \| `"evm.bytecode.functionDebugData"` \| `"evm.bytecode.generatedSources"` \| `"evm.bytecode.linkReferences"` \| `"evm.bytecode.object"` \| `"evm.bytecode.opcodes"` \| `"evm.bytecode.sourceMap"` \| `"evm.deployedBytecode"` \| `"evm.deployedBytecode.immutableReferences"` \| `"evm.deployedBytecode.sourceMap"` \| `"evm.deployedBytecode.opcodes"` \| `"evm.deployedBytecode.object"` \| `"evm.gasEstimates"` \| `"evm.methodIdentifiers"` \| `"evm.legacyAssembly"` \| `"evm.storageLayout"` \| `"ewasm.wasm"` \| `"ewasm.wast"` \| `"ir"` \| `"irOptimized"` \| `"metadata"` \| `"storageLayout"`)[] \| `undefined` |
| `TFilePaths` *extends* `string`[] |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `filePaths` | `TFilePaths` |
| `options?` | `CompileBaseOptions`\<`TLanguage`, `TCompilationOutput`\> |

## Returns

`Promise`\<`CompileFilesResult`\<`TCompilationOutput`, `TFilePaths`\>\>
