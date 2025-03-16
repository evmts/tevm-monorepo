[**tevm**](../../../../../README.md)

***

[tevm](../../../../../modules.md) / [bundler/compiler](../../../README.md) / [compiler](../README.md) / compileContractSync

# Function: compileContractSync()

> **compileContractSync**(`filePath`, `basedir`, `config`, `includeAst`, `includeBytecode`, `fao`, `logger`, `solc`): `CompileContractSyncResult`

Defined in: bundler-packages/compiler/types/src/compiler/compileContractsSync.d.ts:35

Compile the Solidity contract and return its ABI.

## Parameters

### filePath

`string`

### basedir

`string`

### config

`ResolvedCompilerConfig`

### includeAst

`boolean`

### includeBytecode

`boolean`

### fao

`FileAccessObject`

### logger

`Logger`

### solc

`any`

## Returns

`CompileContractSyncResult`

## Example

```ts
const { artifacts, modules } = compileContractSync(
 './contracts/MyContract.sol',
 __dirname,
 config,
 true,
 true,
 await import('fs'),
 logger,
 )
```
