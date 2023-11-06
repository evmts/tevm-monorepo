[Documentation](../README.md) / [@evmts/solc](evmts_solc.md) / resolveArtifacts

# Module: resolveArtifacts

## Table of contents

### Functions

- [resolveArtifacts](evmts_solc.resolveArtifacts.md#resolveartifacts)

## Functions

### resolveArtifacts

▸ **resolveArtifacts**(`solFile`, `basedir`, `logger`, `config`, `includeAst`, `fao`): `Promise`\<\{ `artifacts`: [`Artifacts`](evmts_solc.types.md#artifacts) ; `asts`: `undefined` \| `Record`\<`string`, `Node`\> ; `modules`: `Record`\<``"string"``, [`ModuleInfo`](../interfaces/evmts_resolutions.types.ModuleInfo.md)\> ; `solcInput`: `SolcInputDescription` ; `solcOutput`: `SolcOutput`  }\>

Resolves artifacts with solc asyncronously

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

`Promise`\<\{ `artifacts`: [`Artifacts`](evmts_solc.types.md#artifacts) ; `asts`: `undefined` \| `Record`\<`string`, `Node`\> ; `modules`: `Record`\<``"string"``, [`ModuleInfo`](../interfaces/evmts_resolutions.types.ModuleInfo.md)\> ; `solcInput`: `SolcInputDescription` ; `solcOutput`: `SolcOutput`  }\>

#### Defined in

[solc/src/types.ts:10](https://github.com/evmts/evmts-monorepo/blob/main/bundler/solc/src/types.ts#L10)
