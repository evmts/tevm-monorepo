[@tevm/compiler](../README.md) / [Modules](../modules.md) / types

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
- [ResolvedArtifacts](types.md#resolvedartifacts)

## Type Aliases

### Artifacts

Ƭ **Artifacts**: `Record`\<`string`, `Pick`\<`SolcContractOutput`, ``"abi"`` \| ``"userdoc"`` \| ``"evm"``\>\>

#### Defined in

[compiler/src/types.ts:64](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/compiler/src/types.ts#L64)

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

[compiler/src/types.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/compiler/src/types.ts#L56)

___

### FileAccessObject

Ƭ **FileAccessObject**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `exists` | (`path`: `string`) => `Promise`\<`boolean`\> |
| `existsSync` | (`path`: `string`) => `boolean` |
| `readFile` | (`path`: `string`, `encoding`: `BufferEncoding`) => `Promise`\<`string`\> |
| `readFileSync` | (`path`: `string`, `encoding`: `BufferEncoding`) => `string` |

#### Defined in

[compiler/src/types.ts:40](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/compiler/src/types.ts#L40)

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

[compiler/src/types.ts:47](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/compiler/src/types.ts#L47)

___

### ModuleInfo

Ƭ **ModuleInfo**: `ModuleInfo`

./moduleFactory.js

#### Defined in

resolutions/types/src/index.d.ts:14

___

### ResolveArtifacts

Ƭ **ResolveArtifacts**: (`solFile`: `string`, `basedir`: `string`, `logger`: [`Logger`](types.md#logger), `config`: `ResolvedCompilerConfig`, `includeAst`: `boolean`, `includeBytecode`: `boolean`, `fao`: [`FileAccessObject`](types.md#fileaccessobject), `solc`: `any`) => `Promise`\<[`ResolvedArtifacts`](types.md#resolvedartifacts)\>

#### Type declaration

▸ (`solFile`, `basedir`, `logger`, `config`, `includeAst`, `includeBytecode`, `fao`, `solc`): `Promise`\<[`ResolvedArtifacts`](types.md#resolvedartifacts)\>

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

`Promise`\<[`ResolvedArtifacts`](types.md#resolvedartifacts)\>

#### Defined in

[compiler/src/types.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/compiler/src/types.ts#L18)

___

### ResolveArtifactsSync

Ƭ **ResolveArtifactsSync**: (`solFile`: `string`, `basedir`: `string`, `logger`: [`Logger`](types.md#logger), `config`: `ResolvedCompilerConfig`, `includeAst`: `boolean`, `includeBytecode`: `boolean`, `fao`: [`FileAccessObject`](types.md#fileaccessobject), `solc`: `any`) => [`ResolvedArtifacts`](types.md#resolvedartifacts)

#### Type declaration

▸ (`solFile`, `basedir`, `logger`, `config`, `includeAst`, `includeBytecode`, `fao`, `solc`): [`ResolvedArtifacts`](types.md#resolvedartifacts)

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

[`ResolvedArtifacts`](types.md#resolvedartifacts)

#### Defined in

[compiler/src/types.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/compiler/src/types.ts#L29)

___

### ResolvedArtifacts

Ƭ **ResolvedArtifacts**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `artifacts` | [`Artifacts`](types.md#artifacts) |
| `asts?` | `Record`\<`string`, `Node`\> |
| `modules` | `Record`\<``"string"``, [`ModuleInfo`](types.md#moduleinfo)\> |
| `solcInput` | `SolcInputDescription` |
| `solcOutput` | `SolcOutput` |

#### Defined in

[compiler/src/types.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/compiler/src/types.ts#L10)
