[@evmts/bundler](/reference/schema/README.md) / [Modules](/reference/schema/modules.md) / solc

# Module: solc

## Table of contents

### Functions

- [resolveArtifacts](/reference/schema/modules/solc.md#resolveartifacts)
- [resolveArtifactsSync](/reference/schema/modules/solc.md#resolveartifactssync)

## Functions

### resolveArtifacts

▸ **resolveArtifacts**(`solFile`, `basedir`, `logger`, `config`, `includeAst`, `fao`, `cache?`): `Promise`<{ `artifacts`: `Artifacts` ; `asts`: `undefined` \| `Record`<`string`, `Node`\> ; `modules`: `Record`<``"string"``, `ModuleInfo`\> ; `solcInput`: `SolcInputDescription` ; `solcOutput`: `SolcOutput`  }\>

Currently unimplemented just uses resolveArtifactsSync

#### Parameters

| Name | Type |
| :------ | :------ |
| `solFile` | `string` |
| `basedir` | `string` |
| `logger` | `Logger` |
| `config` | `Required`<`CompilerConfig`\> |
| `includeAst` | `boolean` |
| `fao` | `FileAccessObject` |
| `cache?` | [`Cache`](/reference/schema/modules/createCache.md#cache) |

#### Returns

`Promise`<{ `artifacts`: `Artifacts` ; `asts`: `undefined` \| `Record`<`string`, `Node`\> ; `modules`: `Record`<``"string"``, `ModuleInfo`\> ; `solcInput`: `SolcInputDescription` ; `solcOutput`: `SolcOutput`  }\>

#### Defined in

[bundlers/bundler/src/solc/resolveArtifacts.ts:16](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/solc/resolveArtifacts.ts#L16)

___

### resolveArtifactsSync

▸ **resolveArtifactsSync**(`solFile`, `basedir`, `logger`, `config`, `includeAst`, `fao`, `cache?`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `solFile` | `string` |
| `basedir` | `string` |
| `logger` | `Logger` |
| `config` | `Required`<`CompilerConfig`\> |
| `includeAst` | `boolean` |
| `fao` | `FileAccessObject` |
| `cache?` | [`Cache`](/reference/schema/modules/createCache.md#cache) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `artifacts` | `Artifacts` |
| `asts` | `undefined` \| `Record`<`string`, `Node`\> |
| `modules` | `Record`<``"string"``, `ModuleInfo`\> |
| `solcInput` | `SolcInputDescription` |
| `solcOutput` | `SolcOutput` |

#### Defined in

[bundlers/bundler/src/solc/resolveArtifactsSync.ts:17](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/solc/resolveArtifactsSync.ts#L17)
