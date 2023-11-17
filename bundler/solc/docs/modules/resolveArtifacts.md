[@evmts/solc](../README.md) / [Modules](../modules.md) / resolveArtifacts

# Module: resolveArtifacts

## Table of contents

### Functions

- [resolveArtifacts](resolveArtifacts.md#resolveartifacts)

## Functions

### resolveArtifacts

▸ **resolveArtifacts**(`solFile`, `basedir`, `logger`, `config`, `includeAst`, `includeBytecode`, `fao`): `Promise`\<\{ `artifacts`: [`Artifacts`](types.md#artifacts) ; `asts`: `undefined` \| `Record`\<`string`, `Node`\> ; `modules`: `Record`\<``"string"``, `ModuleInfo`\> ; `solcInput`: `SolcInputDescription` ; `solcOutput`: `SolcOutput`  }\>

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

#### Returns

`Promise`\<\{ `artifacts`: [`Artifacts`](types.md#artifacts) ; `asts`: `undefined` \| `Record`\<`string`, `Node`\> ; `modules`: `Record`\<``"string"``, `ModuleInfo`\> ; `solcInput`: `SolcInputDescription` ; `solcOutput`: `SolcOutput`  }\>

#### Defined in

[solc/src/types.ts:10](https://github.com/evmts/evmts-monorepo/blob/main/bundler/solc/src/types.ts#L10)
