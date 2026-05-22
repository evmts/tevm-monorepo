[**tevm**](../../../README.md)

***

[tevm](../../../modules.md) / [bundler/compiler](../README.md) / compileSources

# Function: compileSources()

> **compileSources**\<`TLanguage`, `TCompilationOutput`\>(`sources`, `options?`): `Promise`\<`CompileSourcesResult`\<`TCompilationOutput`, `string`[]\>\>

## Type Parameters

| Type Parameter |
| ------ |
| `TLanguage` *extends* [`SolcLanguage`](../../solc/type-aliases/SolcLanguage.md) |
| `TCompilationOutput` *extends* (`"abi"` \| `"userdoc"` \| `"*"` \| `"ast"` \| `"devdoc"` \| `"evm.assembly"` \| `"evm.bytecode"` \| `"evm.bytecode.functionDebugData"` \| `"evm.bytecode.generatedSources"` \| `"evm.bytecode.linkReferences"` \| `"evm.bytecode.object"` \| `"evm.bytecode.opcodes"` \| `"evm.bytecode.sourceMap"` \| `"evm.deployedBytecode"` \| `"evm.deployedBytecode.immutableReferences"` \| `"evm.deployedBytecode.sourceMap"` \| `"evm.deployedBytecode.opcodes"` \| `"evm.deployedBytecode.object"` \| `"evm.gasEstimates"` \| `"evm.methodIdentifiers"` \| `"evm.legacyAssembly"` \| `"evm.storageLayout"` \| `"ewasm.wasm"` \| `"ewasm.wast"` \| `"ir"` \| `"irOptimized"` \| `"metadata"` \| `"storageLayout"`)[] \| `undefined` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `sources` | `Record`\<`string`, `TLanguage` *extends* `"SolidityAST"` ? [`SolcAst`](../../solc/type-aliases/SolcAst.md) : `string`\> |
| `options?` | `CompileBaseOptions`\<`TLanguage`, `TCompilationOutput`\> |

## Returns

`Promise`\<`CompileSourcesResult`\<`TCompilationOutput`, `string`[]\>\>
