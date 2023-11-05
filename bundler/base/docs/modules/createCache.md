[@evmts/base](../README.md) / [Modules](../modules.md) / createCache

# Module: createCache

## Table of contents

### Type Aliases

- [Cache](createCache.md#cache)

### Functions

- [createCache](createCache.md#createcache)

## Type Aliases

### Cache

Ƭ **Cache**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `isCached` | (`entryModuleId`: `string`, `sources`: `SolcInputDescription`[``"sources"``]) => `boolean` |
| `read` | (`entryModuleId`: `string`) => `SolcOutput` |
| `write` | (`entryModuleId`: `string`, `compiledContracts`: `SolcOutput`) => `void` |

#### Defined in

[createCache.d.ts:8](https://github.com/evmts/evmts-monorepo/blob/main/bundler/base/src/createCache.d.ts#L8)

## Functions

### createCache

▸ **createCache**(`logger`): [`Cache`](createCache.md#cache)

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | `Logger` |

#### Returns

[`Cache`](createCache.md#cache)

#### Defined in

[createCache.d.ts:17](https://github.com/evmts/evmts-monorepo/blob/main/bundler/base/src/createCache.d.ts#L17)
