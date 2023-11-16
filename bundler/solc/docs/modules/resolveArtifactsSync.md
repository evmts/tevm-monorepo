[@evmts/solc](../README.md) / [Modules](../modules.md) / resolveArtifactsSync

# Module: resolveArtifactsSync

## Table of contents

### Functions

- [resolveArtifactsSync](resolveArtifactsSync.md#resolveartifactssync)

## Functions

### resolveArtifactsSync

▸ **resolveArtifactsSync**(`solFile`, `basedir`, `logger`, `config`, `includeAst`, `includeBytecode`, `fao`): `Object`

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

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `artifacts` | [`Artifacts`](types.md#artifacts) |
| `asts` | `undefined` \| `Record`\<`string`, `Node`\> |
| `modules` | `Record`\<``"string"``, `ModuleInfo`\> |
| `solcInput` | `SolcInputDescription` |
| `solcOutput` | `SolcOutput` |

#### Defined in

[solc/src/types.ts:26](https://github.com/evmts/evmts-monorepo/blob/main/bundler/solc/src/types.ts#L26)
