[@evmts/solc](/reference/solc/README.md) / [Modules](/reference/solc/modules.md) / resolveArtifactsSync

# Module: resolveArtifactsSync

## Table of contents

### Functions

- [resolveArtifactsSync](/reference/solc/modules/resolveArtifactsSync.md#resolveartifactssync)

## Functions

### resolveArtifactsSync

▸ **resolveArtifactsSync**(`solFile`, `basedir`, `logger`, `config`, `includeAst`, `fao`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `solFile` | `string` |
| `basedir` | `string` |
| `logger` | [`Logger`](/reference/solc/modules/types.md#logger) |
| `config` | `ResolvedCompilerConfig` |
| `includeAst` | `boolean` |
| `fao` | [`FileAccessObject`](/reference/solc/modules/types.md#fileaccessobject) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `artifacts` | [`Artifacts`](/reference/solc/modules/types.md#artifacts) |
| `asts` | `undefined` \| `Record`<`string`, `Node`\> |
| `modules` | `Record`<``"string"``, [`ModuleInfo`](/reference/solc/interfaces/types.ModuleInfo.md)\> |
| `solcInput` | `SolcInputDescription` |
| `solcOutput` | `SolcOutput` |

#### Defined in

[resolveArtifactsSync.d.ts:16](https://github.com/evmts/evmts-monorepo/blob/main/solc/src/resolveArtifactsSync.d.ts#L16)
