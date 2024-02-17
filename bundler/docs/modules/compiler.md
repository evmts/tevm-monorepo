[@tevm/bundler](../README.md) / [Modules](../modules.md) / compiler

# Module: compiler

## Table of contents

### Type Aliases

- [Artifacts](compiler.md#artifacts)
- [CompiledContracts](compiler.md#compiledcontracts)
- [FileAccessObject](compiler.md#fileaccessobject)
- [Logger](compiler.md#logger)
- [ModuleInfo](compiler.md#moduleinfo)
- [ResolvedArtifacts](compiler.md#resolvedartifacts)

### Functions

- [resolveArtifacts](compiler.md#resolveartifacts)
- [resolveArtifactsSync](compiler.md#resolveartifactssync)

## Type Aliases

### Artifacts

Ƭ **Artifacts**: `Artifacts`

./types.ts

#### Defined in

bundler-packages/compiler/types/src/index.d.ts:6

___

### CompiledContracts

Ƭ **CompiledContracts**: `CompiledContracts`

./types.ts

#### Defined in

bundler-packages/compiler/types/src/index.d.ts:10

___

### FileAccessObject

Ƭ **FileAccessObject**: `FileAccessObject`

./types.ts

#### Defined in

bundler-packages/compiler/types/src/index.d.ts:14

___

### Logger

Ƭ **Logger**: `Logger`

./types.ts

#### Defined in

bundler-packages/compiler/types/src/index.d.ts:18

___

### ModuleInfo

Ƭ **ModuleInfo**: `ModuleInfo`

./types.ts

#### Defined in

bundler-packages/compiler/types/src/index.d.ts:22

___

### ResolvedArtifacts

Ƭ **ResolvedArtifacts**: `ResolvedArtifacts`

./types.ts

#### Defined in

bundler-packages/compiler/types/src/index.d.ts:26

## Functions

### resolveArtifacts

▸ **resolveArtifacts**(`solFile`, `basedir`, `logger`, `config`, `includeAst`, `includeBytecode`, `fao`, `solc`): `Promise`\<`ResolvedArtifacts`\>

Resolves artifacts with solc asyncronously

#### Parameters

| Name | Type |
| :------ | :------ |
| `solFile` | `string` |
| `basedir` | `string` |
| `logger` | `Logger` |
| `config` | `ResolvedCompilerConfig` |
| `includeAst` | `boolean` |
| `includeBytecode` | `boolean` |
| `fao` | `FileAccessObject` |
| `solc` | `any` |

#### Returns

`Promise`\<`ResolvedArtifacts`\>

#### Defined in

bundler-packages/compiler/types/src/resolveArtifacts.d.ts:5

___

### resolveArtifactsSync

▸ **resolveArtifactsSync**(`solFile`, `basedir`, `logger`, `config`, `includeAst`, `includeBytecode`, `fao`, `solc`): `ResolvedArtifacts`

#### Parameters

| Name | Type |
| :------ | :------ |
| `solFile` | `string` |
| `basedir` | `string` |
| `logger` | `Logger` |
| `config` | `ResolvedCompilerConfig` |
| `includeAst` | `boolean` |
| `includeBytecode` | `boolean` |
| `fao` | `FileAccessObject` |
| `solc` | `any` |

#### Returns

`ResolvedArtifacts`

#### Defined in

bundler-packages/compiler/types/src/resolveArtifactsSync.d.ts:4
