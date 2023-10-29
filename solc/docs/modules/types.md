[@evmts/solc](../README.md) / [Modules](../modules.md) / types

# Module: types

## Table of contents

### Type Aliases

- [Artifacts](types.md#artifacts)
- [CompiledContracts](types.md#compiledcontracts)
- [FileAccessObject](types.md#fileaccessobject)
- [Logger](types.md#logger)
- [ModuleInfo](types.md#moduleinfo)

## Type Aliases

### Artifacts

Ƭ **Artifacts**: `Record`<`string`, `Pick`<`SolcContractOutput`, ``"abi"`` \| ``"userdoc"``\>\>

#### Defined in

[solc/src/types.ts:32](https://github.com/evmts/evmts-monorepo/blob/main/solc/src/types.ts#L32)

___

### CompiledContracts

Ƭ **CompiledContracts**<`TIncludeAsts`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TIncludeAsts` | extends `boolean` = `boolean` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `artifacts` | `SolcOutput`[``"contracts"``][`string`] \| `undefined` |
| `asts` | `TIncludeAsts` extends ``true`` ? `Record`<`string`, `Node`\> : `undefined` |
| `modules` | `Record`<``"string"``, [`ModuleInfo`](types.md#moduleinfo)\> |
| `solcInput` | `SolcInputDescription` |
| `solcOutput` | `SolcOutput` |

#### Defined in

[solc/src/types.ts:24](https://github.com/evmts/evmts-monorepo/blob/main/solc/src/types.ts#L24)

___

### FileAccessObject

Ƭ **FileAccessObject**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `existsSync` | (`path`: `string`) => `boolean` |
| `readFile` | (`path`: `string`, `encoding`: `BufferEncoding`) => `Promise`<`string`\> |
| `readFileSync` | (`path`: `string`, `encoding`: `BufferEncoding`) => `string` |

#### Defined in

[solc/src/types.ts:9](https://github.com/evmts/evmts-monorepo/blob/main/solc/src/types.ts#L9)

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

[solc/src/types.ts:15](https://github.com/evmts/evmts-monorepo/blob/main/solc/src/types.ts#L15)

___

### ModuleInfo

Ƭ **ModuleInfo**: `ModuleInfo`

./moduleFactory.js

#### Defined in

resolutions/types/src/index.d.ts:14
