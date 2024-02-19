[@tevm/compiler](../README.md) / [Modules](../modules.md) / resolveArtifacts

# Module: resolveArtifacts

## Table of contents

### Functions

- [resolveArtifacts](resolveArtifacts.md#resolveartifacts)

## Functions

### resolveArtifacts

▸ **resolveArtifacts**(`solFile`, `basedir`, `logger`, `config`, `includeAst`, `includeBytecode`, `fao`, `solc`): `Promise`\<[`ResolvedArtifacts`](types.md#resolvedartifacts)\>

Resolves artifacts with solc asyncronously

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

`Promise`\<[`ResolvedArtifacts`](types.md#resolvedartifacts)\>

#### Defined in

[compiler/src/resolveArtifacts.js:7](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/compiler/src/resolveArtifacts.js#L7)
