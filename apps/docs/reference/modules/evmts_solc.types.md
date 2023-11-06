[Documentation](../README.md) / [@evmts/solc](evmts_solc.md) / types

# Module: types

## Table of contents

### Type Aliases

- [Artifacts](evmts_solc.types.md#artifacts)
- [CompiledContracts](evmts_solc.types.md#compiledcontracts)
- [FileAccessObject](evmts_solc.types.md#fileaccessobject)
- [Logger](evmts_solc.types.md#logger)
- [ModuleInfo](evmts_solc.types.md#moduleinfo)
- [ResolveArtifacts](evmts_solc.types.md#resolveartifacts)
- [ResolveArtifactsSync](evmts_solc.types.md#resolveartifactssync)

## Type Aliases

### Artifacts

Ƭ **Artifacts**: `Record`\<`string`, `Pick`\<`SolcContractOutput`, ``"abi"`` \| ``"userdoc"``\>\>

#### Defined in

[solc/src/types.ts:63](https://github.com/evmts/evmts-monorepo/blob/main/bundler/solc/src/types.ts#L63)

___

### CompiledContracts

Ƭ **CompiledContracts**\<`TIncludeAsts`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TIncludeAsts` | extends `boolean` = `boolean` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `artifacts` | `SolcOutput`[``"contracts"``][`string`] \| `undefined` |
| `asts` | `TIncludeAsts` extends ``true`` ? `Record`\<`string`, `Node`\> : `undefined` |
| `modules` | `Record`\<``"string"``, [`ModuleInfo`](evmts_solc.types.md#moduleinfo)\> |
| `solcInput` | `SolcInputDescription` |
| `solcOutput` | `SolcOutput` |

#### Defined in

[solc/src/types.ts:55](https://github.com/evmts/evmts-monorepo/blob/main/bundler/solc/src/types.ts#L55)

___

### FileAccessObject

Ƭ **FileAccessObject**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `existsSync` | (`path`: `string`) => `boolean` |
| `readFile` | (`path`: `string`, `encoding`: `BufferEncoding`) => `Promise`\<`string`\> |
| `readFileSync` | (`path`: `string`, `encoding`: `BufferEncoding`) => `string` |

#### Defined in

[solc/src/types.ts:40](https://github.com/evmts/evmts-monorepo/blob/main/bundler/solc/src/types.ts#L40)

___

### Logger

Ƭ **Logger**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `error` | (...`message`: `string`[]) => `void` |
| `info` | (...`messages`: `string`[]) => `void` |
| `log` | (...`message`: `string`[]) => `void` |
| `warn` | (...`message`: `string`[]) => `void` |

#### Defined in

[solc/src/types.ts:46](https://github.com/evmts/evmts-monorepo/blob/main/bundler/solc/src/types.ts#L46)

___

### ModuleInfo

Ƭ **ModuleInfo**: [`types`](evmts_resolutions.types.md)

./moduleFactory.js

#### Defined in

resolutions/types/src/index.d.ts:14

___

### ResolveArtifacts

Ƭ **ResolveArtifacts**: (`solFile`: `string`, `basedir`: `string`, `logger`: [`Logger`](evmts_solc.types.md#logger), `config`: `ResolvedCompilerConfig`, `includeAst`: `boolean`, `fao`: [`FileAccessObject`](evmts_solc.types.md#fileaccessobject)) => `Promise`\<\{ `artifacts`: [`Artifacts`](evmts_solc.types.md#artifacts) ; `asts`: `Record`\<`string`, `Node`\> \| `undefined` ; `modules`: `Record`\<``"string"``, [`ModuleInfo`](evmts_solc.types.md#moduleinfo)\> ; `solcInput`: `SolcInputDescription` ; `solcOutput`: `SolcOutput`  }\>

#### Type declaration

▸ (`solFile`, `basedir`, `logger`, `config`, `includeAst`, `fao`): `Promise`\<\{ `artifacts`: [`Artifacts`](evmts_solc.types.md#artifacts) ; `asts`: `Record`\<`string`, `Node`\> \| `undefined` ; `modules`: `Record`\<``"string"``, [`ModuleInfo`](evmts_solc.types.md#moduleinfo)\> ; `solcInput`: `SolcInputDescription` ; `solcOutput`: `SolcOutput`  }\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `solFile` | `string` |
| `basedir` | `string` |
| `logger` | [`Logger`](evmts_solc.types.md#logger) |
| `config` | `ResolvedCompilerConfig` |
| `includeAst` | `boolean` |
| `fao` | [`FileAccessObject`](evmts_solc.types.md#fileaccessobject) |

##### Returns

`Promise`\<\{ `artifacts`: [`Artifacts`](evmts_solc.types.md#artifacts) ; `asts`: `Record`\<`string`, `Node`\> \| `undefined` ; `modules`: `Record`\<``"string"``, [`ModuleInfo`](evmts_solc.types.md#moduleinfo)\> ; `solcInput`: `SolcInputDescription` ; `solcOutput`: `SolcOutput`  }\>

#### Defined in

[solc/src/types.ts:10](https://github.com/evmts/evmts-monorepo/blob/main/bundler/solc/src/types.ts#L10)

___

### ResolveArtifactsSync

Ƭ **ResolveArtifactsSync**: (`solFile`: `string`, `basedir`: `string`, `logger`: [`Logger`](evmts_solc.types.md#logger), `config`: `ResolvedCompilerConfig`, `includeAst`: `boolean`, `fao`: [`FileAccessObject`](evmts_solc.types.md#fileaccessobject)) => \{ `artifacts`: [`Artifacts`](evmts_solc.types.md#artifacts) ; `asts`: `Record`\<`string`, `Node`\> \| `undefined` ; `modules`: `Record`\<``"string"``, [`ModuleInfo`](evmts_solc.types.md#moduleinfo)\> ; `solcInput`: `SolcInputDescription` ; `solcOutput`: `SolcOutput`  }

#### Type declaration

▸ (`solFile`, `basedir`, `logger`, `config`, `includeAst`, `fao`): `Object`

##### Parameters

| Name | Type |
| :------ | :------ |
| `solFile` | `string` |
| `basedir` | `string` |
| `logger` | [`Logger`](evmts_solc.types.md#logger) |
| `config` | `ResolvedCompilerConfig` |
| `includeAst` | `boolean` |
| `fao` | [`FileAccessObject`](evmts_solc.types.md#fileaccessobject) |

##### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `artifacts` | [`Artifacts`](evmts_solc.types.md#artifacts) |
| `asts` | `Record`\<`string`, `Node`\> \| `undefined` |
| `modules` | `Record`\<``"string"``, [`ModuleInfo`](evmts_solc.types.md#moduleinfo)\> |
| `solcInput` | `SolcInputDescription` |
| `solcOutput` | `SolcOutput` |

#### Defined in

[solc/src/types.ts:25](https://github.com/evmts/evmts-monorepo/blob/main/bundler/solc/src/types.ts#L25)
