[@tevm/solc](../README.md) / [Modules](../modules.md) / types

# Module: types

## Table of contents

### Type Aliases

- [Artifacts](types.md#artifacts)
- [CompiledContracts](types.md#compiledcontracts)
- [FileAccessObject](types.md#fileaccessobject)
- [Logger](types.md#logger)
- [ModuleInfo](types.md#moduleinfo)
- [ResolveArtifacts](types.md#resolveartifacts)
- [ResolveArtifactsSync](types.md#resolveartifactssync)

## Type Aliases

### Artifacts

Ƭ **Artifacts**: `Record`\<`string`, `Pick`\<`SolcContractOutput`, ``"abi"`` \| ``"userdoc"`` \| ``"evm"``\>\>

#### Defined in

[solc/src/types.ts:67](https://github.com/evmts/tevm-monorepo/blob/main/bundler/solc/src/types.ts#L67)

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
| `modules` | `Record`\<``"string"``, [`ModuleInfo`](types.md#moduleinfo)\> |
| `solcInput` | `SolcInputDescription` |
| `solcOutput` | `SolcOutput` |

#### Defined in

[solc/src/types.ts:59](https://github.com/evmts/tevm-monorepo/blob/main/bundler/solc/src/types.ts#L59)

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

[solc/src/types.ts:44](https://github.com/evmts/tevm-monorepo/blob/main/bundler/solc/src/types.ts#L44)

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

[solc/src/types.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/bundler/solc/src/types.ts#L50)

___

### ModuleInfo

Ƭ **ModuleInfo**: `ModuleInfo`

./moduleFactory.js

#### Defined in

resolutions/types/src/index.d.ts:14

___

### ResolveArtifacts

Ƭ **ResolveArtifacts**: (`solFile`: `string`, `basedir`: `string`, `logger`: [`Logger`](types.md#logger), `config`: `ResolvedCompilerConfig`, `includeAst`: `boolean`, `includeBytecode`: `boolean`, `fao`: [`FileAccessObject`](types.md#fileaccessobject), `solc`: `any`) => `Promise`\<\{ `artifacts`: [`Artifacts`](types.md#artifacts) ; `asts`: `Record`\<`string`, `Node`\> \| `undefined` ; `modules`: `Record`\<``"string"``, [`ModuleInfo`](types.md#moduleinfo)\> ; `solcInput`: `SolcInputDescription` ; `solcOutput`: `SolcOutput`  }\>

#### Type declaration

▸ (`solFile`, `basedir`, `logger`, `config`, `includeAst`, `includeBytecode`, `fao`, `solc`): `Promise`\<\{ `artifacts`: [`Artifacts`](types.md#artifacts) ; `asts`: `Record`\<`string`, `Node`\> \| `undefined` ; `modules`: `Record`\<``"string"``, [`ModuleInfo`](types.md#moduleinfo)\> ; `solcInput`: `SolcInputDescription` ; `solcOutput`: `SolcOutput`  }\>

##### Parameters

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

##### Returns

`Promise`\<\{ `artifacts`: [`Artifacts`](types.md#artifacts) ; `asts`: `Record`\<`string`, `Node`\> \| `undefined` ; `modules`: `Record`\<``"string"``, [`ModuleInfo`](types.md#moduleinfo)\> ; `solcInput`: `SolcInputDescription` ; `solcOutput`: `SolcOutput`  }\>

#### Defined in

[solc/src/types.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/bundler/solc/src/types.ts#L10)

___

### ResolveArtifactsSync

Ƭ **ResolveArtifactsSync**: (`solFile`: `string`, `basedir`: `string`, `logger`: [`Logger`](types.md#logger), `config`: `ResolvedCompilerConfig`, `includeAst`: `boolean`, `includeBytecode`: `boolean`, `fao`: [`FileAccessObject`](types.md#fileaccessobject), `solc`: `any`) => \{ `artifacts`: [`Artifacts`](types.md#artifacts) ; `asts`: `Record`\<`string`, `Node`\> \| `undefined` ; `modules`: `Record`\<``"string"``, [`ModuleInfo`](types.md#moduleinfo)\> ; `solcInput`: `SolcInputDescription` ; `solcOutput`: `SolcOutput`  }

#### Type declaration

▸ (`solFile`, `basedir`, `logger`, `config`, `includeAst`, `includeBytecode`, `fao`, `solc`): `Object`

##### Parameters

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

##### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `artifacts` | [`Artifacts`](types.md#artifacts) |
| `asts` | `Record`\<`string`, `Node`\> \| `undefined` |
| `modules` | `Record`\<``"string"``, [`ModuleInfo`](types.md#moduleinfo)\> |
| `solcInput` | `SolcInputDescription` |
| `solcOutput` | `SolcOutput` |

#### Defined in

[solc/src/types.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/bundler/solc/src/types.ts#L27)
