[**tevm**](../../../../../README.md)

***

[tevm](../../../../../modules.md) / [bundler/compiler](../../../README.md) / [compiler](../README.md) / compileContract

# Function: compileContract()

> **compileContract**\<`TIncludeAsts`, `TIncludeBytecode`\>(`filePath`, `basedir`, `config`, `includeAst`, `includeBytecode`, `fao`, `logger`, `solc`): `Promise`\<`CompiledContracts`\<`TIncludeAsts`\>\>

Defined in: bundler-packages/compiler/types/src/compiler/compileContracts.d.ts:1

## Type Parameters

• **TIncludeAsts**

• **TIncludeBytecode**

## Parameters

### filePath

`string`

### basedir

`string`

### config

`ResolvedCompilerConfig`

### includeAst

`TIncludeAsts`

### includeBytecode

`TIncludeBytecode`

### fao

`FileAccessObject`

### logger

`Logger`

### solc

`any`

## Returns

`Promise`\<`CompiledContracts`\<`TIncludeAsts`\>\>
