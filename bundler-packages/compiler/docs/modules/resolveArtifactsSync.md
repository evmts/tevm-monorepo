[@tevm/compiler](../README.md) / [Modules](../modules.md) / resolveArtifactsSync

# Module: resolveArtifactsSync

## Table of contents

### Functions

- [resolveArtifactsSync](resolveArtifactsSync.md#resolveartifactssync)

## Functions

### resolveArtifactsSync

▸ **resolveArtifactsSync**(`solFile`, `basedir`, `logger`, `config`, `includeAst`, `includeBytecode`, `fao`, `solc`): [`ResolvedArtifacts`](types.md#resolvedartifacts)

#### Parameters

| Name | Type |
| :------ | :------ |
| `solFile` | `string` |
| `basedir` | `string` |
| `logger` | [`Logger`](types.md#logger) |
| `config` | `ResolvedCompilerConfig` |
| `includeAst` | `boolean` |
| `includeBytecode` | `boolean` |
| `fao` | [`FileAccessObject`](types.md#fileaccessobject) |
| `solc` | `any` |

#### Returns

[`ResolvedArtifacts`](types.md#resolvedartifacts)

#### Defined in

[compiler/src/resolveArtifactsSync.js:6](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/compiler/src/resolveArtifactsSync.js#L6)
