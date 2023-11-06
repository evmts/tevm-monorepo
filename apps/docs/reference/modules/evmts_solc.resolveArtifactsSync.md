[Documentation](../README.md) / [@evmts/solc](evmts_solc.md) / resolveArtifactsSync

# Module: resolveArtifactsSync

## Table of contents

### Functions

- [resolveArtifactsSync](evmts_solc.resolveArtifactsSync.md#resolveartifactssync)

## Functions

### resolveArtifactsSync

▸ **resolveArtifactsSync**(`solFile`, `basedir`, `logger`, `config`, `includeAst`, `fao`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `solFile` | `string` |
| `basedir` | `string` |
| `logger` | [`Logger`](evmts_solc.types.md#logger) |
| `config` | [`ResolvedCompilerConfig`](evmts_config.types.md#resolvedcompilerconfig) |
| `includeAst` | `boolean` |
| `fao` | [`FileAccessObject`](evmts_solc.types.md#fileaccessobject) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `artifacts` | [`Artifacts`](evmts_solc.types.md#artifacts) |
| `asts` | `undefined` \| `Record`\<`string`, `Node`\> |
| `modules` | `Record`\<``"string"``, [`ModuleInfo`](../interfaces/evmts_resolutions.types.ModuleInfo.md)\> |
| `solcInput` | `SolcInputDescription` |
| `solcOutput` | `SolcOutput` |

#### Defined in

[solc/src/types.ts:25](https://github.com/evmts/evmts-monorepo/blob/main/bundler/solc/src/types.ts#L25)
