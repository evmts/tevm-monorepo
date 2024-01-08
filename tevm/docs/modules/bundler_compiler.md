[tevm](../README.md) / [Modules](../modules.md) / bundler/compiler

# Module: bundler/compiler

## Table of contents

### Type Aliases

- [Artifacts](bundler_compiler.md#artifacts)
- [CompiledContracts](bundler_compiler.md#compiledcontracts)
- [FileAccessObject](bundler_compiler.md#fileaccessobject)
- [Logger](bundler_compiler.md#logger)
- [ModuleInfo](bundler_compiler.md#moduleinfo)
- [ResolvedArtifacts](bundler_compiler.md#resolvedartifacts)

### Functions

- [resolveArtifacts](bundler_compiler.md#resolveartifacts)
- [resolveArtifactsSync](bundler_compiler.md#resolveartifactssync)

## Type Aliases

### Artifacts

Ƭ **Artifacts**: `Artifacts$1`

./types.ts

#### Defined in

bundler/compiler/dist/index.d.ts:51

___

### CompiledContracts

Ƭ **CompiledContracts**: `CompiledContracts$1`

./types.ts

#### Defined in

bundler/compiler/dist/index.d.ts:55

___

### FileAccessObject

Ƭ **FileAccessObject**: `FileAccessObject$1`

./types.ts

#### Defined in

bundler/compiler/dist/index.d.ts:59

___

### Logger

Ƭ **Logger**: `Logger$1`

./types.ts

#### Defined in

bundler/compiler/dist/index.d.ts:63

___

### ModuleInfo

Ƭ **ModuleInfo**: `ModuleInfo$1`

./types.ts

#### Defined in

bundler/compiler/dist/index.d.ts:67

___

### ResolvedArtifacts

Ƭ **ResolvedArtifacts**: `ResolvedArtifacts$1`

./types.ts

#### Defined in

bundler/compiler/dist/index.d.ts:71

## Functions

### resolveArtifacts

▸ **resolveArtifacts**(`solFile`, `basedir`, `logger`, `config`, `includeAst`, `includeBytecode`, `fao`, `solc`): `Promise`\<`ResolvedArtifacts$1`\>

Resolves artifacts with solc asyncronously

#### Parameters

| Name | Type |
| :------ | :------ |
| `solFile` | `string` |
| `basedir` | `string` |
| `logger` | `Logger$1` |
| `config` | `ResolvedCompilerConfig$1` |
| `includeAst` | `boolean` |
| `includeBytecode` | `boolean` |
| `fao` | `FileAccessObject$1` |
| `solc` | `any` |

#### Returns

`Promise`\<`ResolvedArtifacts$1`\>

#### Defined in

bundler/compiler/dist/index.d.ts:13

___

### resolveArtifactsSync

▸ **resolveArtifactsSync**(`solFile`, `basedir`, `logger`, `config`, `includeAst`, `includeBytecode`, `fao`, `solc`): `ResolvedArtifacts$1`

#### Parameters

| Name | Type |
| :------ | :------ |
| `solFile` | `string` |
| `basedir` | `string` |
| `logger` | `Logger$1` |
| `config` | `ResolvedCompilerConfig$1` |
| `includeAst` | `boolean` |
| `includeBytecode` | `boolean` |
| `fao` | `FileAccessObject$1` |
| `solc` | `any` |

#### Returns

`ResolvedArtifacts$1`

#### Defined in

bundler/compiler/dist/index.d.ts:14
