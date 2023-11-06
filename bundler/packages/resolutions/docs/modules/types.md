[@evmts/resolutions](../README.md) / [Modules](../modules.md) / types

# Module: types

## Table of contents

### Interfaces

- [ModuleInfo](../interfaces/types.ModuleInfo.md)

### Type Aliases

- [FileAccessObject](types.md#fileaccessobject)
- [Logger](types.md#logger)
- [ResolvedImport](types.md#resolvedimport)

## Type Aliases

### FileAccessObject

Ƭ **FileAccessObject**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `existsSync` | (`path`: `string`) => `boolean` |
| `readFile` | (`path`: `string`, `encoding`: `BufferEncoding`) => `Promise`\<`string`\> |
| `readFileSync` | (`path`: `string`, `encoding`: `BufferEncoding`) => `string` |

#### Defined in

[types.ts:1](https://github.com/evmts/evmts-monorepo/blob/main/bundler/resolutions/src/types.ts#L1)

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

[types.ts:7](https://github.com/evmts/evmts-monorepo/blob/main/bundler/resolutions/src/types.ts#L7)

___

### ResolvedImport

Ƭ **ResolvedImport**: `Object`

The result of the resolution of an  import

#### Type declaration

| Name | Type |
| :------ | :------ |
| `absolute` | `string` |
| `original` | `string` |
| `updated` | `string` |

#### Defined in

[types.ts:27](https://github.com/evmts/evmts-monorepo/blob/main/bundler/resolutions/src/types.ts#L27)
