[@evmts/solc](/reference/solc/README.md) / [Modules](/reference/solc/modules.md) / types

# Module: types

## Table of contents

### Interfaces

- [ModuleInfo](/reference/solc/interfaces/types.ModuleInfo.md)

### Type Aliases

- [Artifacts](/reference/solc/modules/types.md#artifacts)
- [CompiledContracts](/reference/solc/modules/types.md#compiledcontracts)
- [FileAccessObject](/reference/solc/modules/types.md#fileaccessobject)
- [Logger](/reference/solc/modules/types.md#logger)

## Type Aliases

### Artifacts

Ƭ **Artifacts**: `Record`<`string`, `Pick`<`SolcContractOutput`, ``"abi"`` \| ``"userdoc"``\>\>

#### Defined in

[types.ts:40](https://github.com/evmts/evmts-monorepo/blob/main/solc/src/types.ts#L40)

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
| `modules` | `Record`<``"string"``, [`ModuleInfo`](/reference/solc/interfaces/types.ModuleInfo.md)\> |
| `solcInput` | `SolcInputDescription` |
| `solcOutput` | `SolcOutput` |

#### Defined in

[types.ts:32](https://github.com/evmts/evmts-monorepo/blob/main/solc/src/types.ts#L32)

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

[types.ts:8](https://github.com/evmts/evmts-monorepo/blob/main/solc/src/types.ts#L8)

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

[types.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/solc/src/types.ts#L14)
