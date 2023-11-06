[Documentation](../README.md) / [@evmts/base](evmts_base.md) / createCache

# Module: createCache

## Table of contents

### Type Aliases

- [Cache](evmts_base.createCache.md#cache)

### Functions

- [createCache](evmts_base.createCache.md#createcache)

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

▸ **createCache**(`logger`): [`Cache`](evmts_base.createCache.md#cache)

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | `Logger` |

#### Returns

[`Cache`](evmts_base.createCache.md#cache)

#### Defined in

[createCache.d.ts:17](https://github.com/evmts/evmts-monorepo/blob/main/bundler/base/src/createCache.d.ts#L17)
